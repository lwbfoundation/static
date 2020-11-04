import saveMailchimpSignup from 'gatsby-plugin-mailchimp';
import type { SignupFormValues } from '../form';
import categories from './categories.json';

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

function createGroupProperties(
  groups: NewsletterGroup[]
): Record<string, number> {
  return groups.reduce((acc, group) => {
    acc[`group[${categories.categoryId}][${categories.groups[group].id}]`] =
      categories.groups[group].id;
    return acc;
  }, {} as Record<string, number>);
}

type MailchimpSignupResult = {
  result: string;
  msg: string;
};

function signupForNewsletter({
  firstName,
  lastName,
  email,
  groups,
}: NewsletterSignupValues): Promise<MailchimpSignupResult> {
  return saveMailchimpSignup(email, {
    FNAME: firstName,
    LNAME: lastName,
    ...createGroupProperties(groups),
  });
}

export default signupForNewsletter;
