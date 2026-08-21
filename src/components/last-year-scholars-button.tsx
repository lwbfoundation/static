import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { SubmitButton } from './form';

/** Redirects to the newest year of recipients; the fallback if none resolve. */
const RECIPIENTS_ROOT = '/scholarship/recipients/';

type RecipientsPagesData = Readonly<{
  recipientsPages: {
    nodes: {
      uri: string;
      date: string;
    }[];
  };
}>;

/**
 * Way into the most recent class of scholars, shown while applications are
 * closed so the application and recommendation pages still lead somewhere.
 */
const LastYearScholarsButton: FunctionComponent = () => {
  const { recipientsPages }: RecipientsPagesData = useStaticQuery(graphql`
    {
      recipientsPages: allWpPage(
        filter: {
          customDisplaySettings: { statictemplate: { eq: "recipients" } }
        }
        sort: { fields: date, order: DESC }
      ) {
        nodes {
          uri
          date
        }
      }
    }
  `);

  const latest = recipientsPages.nodes[0];

  return (
    <SubmitButton
      as="a"
      href={latest ? latest.uri : RECIPIENTS_ROOT}
      marginTop={4}
      fontSize="xl"
      display="inline-block"
      paddingTop="0.7em"
      height={12}
    >
      View last year&apos;s scholars
    </SubmitButton>
  );
};

export default LastYearScholarsButton;
