import type { SignupFormValues } from '../form';

// eslint-disable-next-line no-shadow
export enum NewsletterGroup {
  DESIGN_STUDENT = 'design_student',
  DESIGN_PROFESSIONAL = 'design_professional',
  DESIGN_EDUCATOR = 'design_educator',
  COMMUNITY_MEMBER = 'community_member',
  SCHOLARSHIP_OPPORTUNITIES = 'scholarship_opportunities',
  DONOR = 'donor',
}

type NewsletterSignupValues = SignupFormValues & {
  groups: NewsletterGroup[];
};

export type MailchimpSignupResult = {
  result: 'success' | 'error';
  msg: string;
};

const genericMessage =
  'There was an error submitting your email address. Please try again.';

/**
 * Posts to our own Netlify function rather than to Mailchimp directly.
 * Mailchimp removed the JSONP endpoint that `gatsby-plugin-mailchimp` used,
 * and the endpoint that replaced it can't be reached from the browser, so the
 * request goes through `netlify/functions/newsletter-signup.ts`. The group
 * name to Mailchimp field mapping now lives there too.
 *
 * Always resolves to a well-formed result. That matters because the failure
 * modes here don't look like failures: a function that crashes returns a 502
 * whose body is Netlify's own error JSON, which parses cleanly and has no
 * `result` field. Callers must be able to trust `result` alone, so anything
 * that isn't a recognizable success is reported as an error.
 */
async function signupForNewsletter({
  firstName,
  lastName,
  email,
  groups,
}: NewsletterSignupValues): Promise<MailchimpSignupResult> {
  let response: Response;
  try {
    response = await fetch('/.netlify/functions/newsletter-signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, groups }),
    });
  } catch (e) {
    // Offline, DNS failure, request blocked by an extension.
    return { result: 'error', msg: genericMessage };
  }

  let body: Partial<MailchimpSignupResult>;
  try {
    body = (await response.json()) as Partial<MailchimpSignupResult>;
  } catch (e) {
    return { result: 'error', msg: genericMessage };
  }

  // A 502 from a crashed function still carries a parseable JSON body, so the
  // status has to be checked separately from the shape.
  if (!response.ok) {
    return { result: 'error', msg: genericMessage };
  }

  if (body.result !== 'success' && body.result !== 'error') {
    return { result: 'error', msg: genericMessage };
  }

  return { result: body.result, msg: body.msg ?? genericMessage };
}

export default signupForNewsletter;
