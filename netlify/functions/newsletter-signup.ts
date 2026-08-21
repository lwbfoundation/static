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
 * Asking for JSONP is what keeps this readable. Without a callback param the
 * endpoint answers a real submission with 33KB of hosted signup page, which
 * can't be told apart from a failure without scraping it. With one, every
 * outcome comes back as `callback({"result":…,"msg":…})`.
 */
const jsonpCallback = 'lwbNewsletterSignup';

/**
 * Unwraps `callback({…})`. Mailchimp also answers plain JSON when it rejects a
 * request before it gets as far as producing JSONP — a missing email, say — so
 * a bare object is accepted too.
 */
function interpret(status: number, body: string): MailchimpResult {
  const unwrapped = body.trim().replace(/^[\w$.]+\s*\(([\s\S]*)\)\s*;?$/, '$1');

  try {
    const parsed = JSON.parse(unwrapped) as Partial<MailchimpResult>;
    if (parsed.result === 'success' || parsed.result === 'error') {
      return { result: parsed.result, msg: parsed.msg ?? '' };
    }
  } catch (e) {
    // Not JSON or JSONP — fall through and fail closed below.
  }

  // Anything else means we got the hosted page back and genuinely can't tell
  // what happened, so say so rather than claiming a signup that may not exist.
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
    c: jsonpCallback,
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
