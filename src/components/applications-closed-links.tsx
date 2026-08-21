import React, { FunctionComponent } from 'react';
import { SubmitButton } from './form';
import LastYearScholarsButton from './last-year-scholars-button';

/**
 * What the application and recommendation pages offer while applications are
 * closed: last year's scholars to look at now, and the newsletter to keep in
 * touch.
 */
const ApplicationsClosedLinks: FunctionComponent = () => (
  <>
    <LastYearScholarsButton />
    <SubmitButton
      as="a"
      href="/#sign-up"
      marginTop={4}
      marginLeft={[0, 3]}
      fontSize="xl"
      display="inline-block"
      paddingTop="0.7em"
      height={12}
    >
      Sign up for our newsletter
    </SubmitButton>
  </>
);

export default ApplicationsClosedLinks;
