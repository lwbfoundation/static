import categories from '../../src/components/newsletter-signup/categories.json';

/**
 * Mailchimp retired the `/subscribe/post-json` JSONP endpoint that
 * `gatsby-plugin-mailchimp` called straight from the browser — it 404s now.
 * The classic `/subscribe/post` endpoint still works, but it sends no CORS
 * headers, so the signup has to hop through a server. This is the same shape
 * as the `signUp` server action in tuneshine-dot-rocks.
 *
 * This is a Netlify v2 function: it takes a `Request` and must return a
 * `Response`. Returning the older `{ statusCode, body }` lambda shape fails at
 * runtime with "Function returned an unsupported value".
 *
 * The JSON body it responds with (`{ result, msg }`) is deliberately identical
 * to what the old plugin returned, so callers didn't have to change.
 */

type MailchimpResult = {
  result: 'success' | 'error';
  msg: string;
};

type SignupRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  groups?: string[];
};

const emailIsValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Matches the message the old plugin produced, which newsletter-signup.tsx
// still string-matches on to show the friendly email error.
const invalidEmailMessage = 'The email you entered is not valid.';
const genericMessage =
  'There was an error submitting your email address. Please try again.';

const json = (statusCode: number, body: MailchimpResult) =>
  new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  });

/**
 * The configured form URL comes out of Mailchimp's embed code, where it is
 * HTML-escaped (`&amp;id=`). Left alone that swallows the `id` param and the
 * request lands on the wrong list, so unescape it before use.
 */
function mailchimpEndpoint(): string {
  const configured = process.env.MAILCHIMP_FORM_URL;
  if (!configured) throw new Error('MAILCHIMP_FORM_URL is not set');
  return configured.replace(/&amp;/g, '&');
}

function groupParams(groups: string[]): Record<string, string> {
  return groups.reduce((acc, group) => {
    const category = categories.groups[group as keyof typeof categories.groups];
    // Silently skip unknown group names rather than failing the whole signup —
    // a stale name in the client shouldn't cost us the subscriber.
    if (!category) return acc;
    acc[`group[${categories.categoryId}][${category.id}]`] = String(
      category.id
    );
    return acc;
  }, {} as Record<string, string>);
}

/**
 * The endpoint always answers `text/html`, but the body is JSON whenever
 * Mailchimp has an actual verdict on the address — success, already
 * subscribed, blank email. Anything else means we got the hosted signup page
 * back and can't tell what happened, so we fail closed rather than telling
 * someone they're subscribed when they may not be.
 */
function interpret(status: number, body: string): MailchimpResult {
  try {
    const parsed = JSON.parse(body) as Partial<MailchimpResult>;
    if (parsed.result === 'success' || parsed.result === 'error') {
      return { result: parsed.result, msg: parsed.msg ?? '' };
    }
  } catch (e) {
    // Not JSON — fall through to the status check below.
  }

  // A redirect to the "almost finished, confirm your email" page is a success.
  if (status >= 300 && status < 400) {
    return { result: 'success', msg: 'Thank you for subscribing!' };
  }

  // eslint-disable-next-line no-console
  console.error('Unrecognized Mailchimp response', status, body.slice(0, 500));
  return { result: 'error', msg: genericMessage };
}

export default async function newsletterSignup(
  request: Request
): Promise<Response> {
  if (request.method !== 'POST') {
    return json(405, { result: 'error', msg: 'Method not allowed' });
  }

  let payload: SignupRequest;
  try {
    payload = (await request.json()) as SignupRequest;
  } catch (e) {
    return json(400, { result: 'error', msg: genericMessage });
  }

  const { firstName, lastName, email, groups } = payload;

  if (!email || !emailIsValid(email)) {
    return json(200, { result: 'error', msg: invalidEmailMessage });
  }

  const params = new URLSearchParams({
    EMAIL: email,
    ...(firstName ? { FNAME: firstName } : {}),
    ...(lastName ? { LNAME: lastName } : {}),
    ...groupParams(groups ?? []),
  });

  try {
    const endpoint = mailchimpEndpoint();
    const separator = endpoint.includes('?') ? '&' : '?';
    // Mailchimp is normally quick; don't leave the visitor hanging if it isn't.
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 10000);

    try {
      const response = await fetch(
        `${endpoint}${separator}${params.toString()}`,
        {
          // Don't follow the confirmation-page redirect; seeing the 3xx is how
          // we recognize a success that came back without a JSON body.
          redirect: 'manual',
          signal: abort.signal,
        }
      );

      return json(200, interpret(response.status, await response.text()));
    } finally {
      clearTimeout(timeout);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error submitting to Mailchimp', e);
    return json(200, { result: 'error', msg: genericMessage });
  }
}
