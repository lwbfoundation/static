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

type MailchimpSignupResult = {
  result: string;
  msg: string;
};

/**
 * Posts to our own Netlify function rather than to Mailchimp directly.
 * Mailchimp removed the JSONP endpoint that `gatsby-plugin-mailchimp` used,
 * and the endpoint that replaced it can't be reached from the browser, so the
 * request goes through `netlify/functions/newsletter-signup.ts`. The group
 * name to Mailchimp field mapping now lives there too.
 */
async function signupForNewsletter({
  firstName,
  lastName,
  email,
  groups,
}: NewsletterSignupValues): Promise<MailchimpSignupResult> {
  const response = await fetch('/.netlify/functions/newsletter-signup', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName, lastName, email, groups }),
  });

  return (await response.json()) as MailchimpSignupResult;
}

export default signupForNewsletter;
