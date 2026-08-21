import { get as httpsGet } from 'https';
import categories from '../../src/components/newsletter-signup/categories.json';

/**
 * Mailchimp retired the `/subscribe/post-json` JSONP endpoint that
 * `gatsby-plugin-mailchimp` called straight from the browser — it 404s now.
 * The classic `/subscribe/post` endpoint still works, but it sends no CORS
 * headers, so the signup has to hop through a server. This is the same shape
 * as the `signUp` server action in tuneshine-dot-rocks.
 *
 * The response contract (`{ result, msg }`) is deliberately identical to what
 * the old plugin returned, so callers didn't have to change.
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

// Netlify's handler types, inlined rather than pulling in `@netlify/functions`,
// which wants a newer Node than this project pins.
type HandlerEvent = {
  httpMethod: string;
  body: string | null;
};

type HandlerResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

const emailIsValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Matches the message the old plugin produced, which newsletter-signup.tsx
// still string-matches on to show the friendly email error.
const invalidEmailMessage = 'The email you entered is not valid.';
const genericMessage =
  'There was an error submitting your email address. Please try again.';

const json = (statusCode: number, body: MailchimpResult): HandlerResponse => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
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

function fetchText(url: string): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const request = httpsGet(url, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () =>
        resolve({ statusCode: response.statusCode ?? 0, body })
      );
    });

    request.on('error', reject);
    // Mailchimp is normally quick; don't leave the visitor hanging if it isn't.
    request.setTimeout(10000, () => {
      request.destroy(new Error('Timed out talking to Mailchimp'));
    });
  });
}

/**
 * The endpoint always answers `text/html`, but the body is JSON whenever
 * Mailchimp has an actual verdict on the address — success, already
 * subscribed, blank email. Anything else means we got the hosted signup page
 * back and can't tell what happened, so we fail closed rather than telling
 * someone they're subscribed when they may not be.
 */
function interpret(statusCode: number, body: string): MailchimpResult {
  try {
    const parsed = JSON.parse(body) as Partial<MailchimpResult>;
    if (parsed.result === 'success' || parsed.result === 'error') {
      return { result: parsed.result, msg: parsed.msg ?? '' };
    }
  } catch (e) {
    // Not JSON — fall through to the status-code check below.
  }

  // A redirect to the "almost finished, confirm your email" page is a success.
  if (statusCode >= 300 && statusCode < 400) {
    return { result: 'success', msg: 'Thank you for subscribing!' };
  }

  // eslint-disable-next-line no-console
  console.error(
    'Unrecognized Mailchimp response',
    statusCode,
    body.slice(0, 500)
  );
  return { result: 'error', msg: genericMessage };
}

export async function handler(event: HandlerEvent): Promise<HandlerResponse> {
  if (event.httpMethod !== 'POST') {
    return json(405, { result: 'error', msg: 'Method not allowed' });
  }

  let payload: SignupRequest;
  try {
    payload = JSON.parse(event.body ?? '{}') as SignupRequest;
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
    const { statusCode, body } = await fetchText(
      `${endpoint}${separator}${params.toString()}`
    );

    return json(200, interpret(statusCode, body));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error submitting to Mailchimp', e);
    return json(200, { result: 'error', msg: genericMessage });
  }
}

export default handler;
