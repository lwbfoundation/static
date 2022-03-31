import React, { ComponentType, FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import BlogPost from '../../components/template-parts/blog-post';
import Placeholder from '../../components/template-parts/placeholder';
import Homepage from '../../components/template-parts/homepage';
import ThankYouPage from '../../components/template-parts/thank-you-page';
import ScholarshipPage from '../../components/template-parts/scholarship';

export interface PageTemplateProps {
  data: PageQueryResult;
}

type PageTemplate = ComponentType<PageTemplateProps>;

const templates: { [key: string]: PageTemplate } = {
  default: BlogPost,
  homepage: Homepage,
  placeholder: Placeholder,
  'thank-you': ThankYouPage,
  scholarship: ScholarshipPage,
};

interface CustomDisplaySettings {
  readonly statictemplate: string;
}

interface CustomCommonDataFields {
  readonly subheading: string;
  readonly donatebuttontext: string;
  readonly newslettersignupbuttontext: string;
  readonly legalinfo: string;
  readonly address: string;
  readonly contactemail: string;
}

interface CommonSiteSettings {
  readonly title: string;
  readonly customCommonDataFields: CustomCommonDataFields;
}

interface Page {
  readonly uri: string;
  readonly title: string;
  readonly content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly featuredImage: any;
  readonly customDisplaySettings: CustomDisplaySettings;
  readonly wpParent: {
    node: Page;
  } | null;
}

interface PageQueryResult {
  readonly page: Page;
  readonly wpCommonSiteSettings: CommonSiteSettings;
  readonly nextPage: Page;
  readonly previousPage: Page;
}

const Page: FunctionComponent<PageTemplateProps> = ({ data }) => {
  const Template =
    templates[data.page.customDisplaySettings.statictemplate] ||
    templates.default;
  return <Template data={data} />;
};

export default Page;

export const query = graphql`
  query page($id: String!, $nextPage: String, $previousPage: String) {
    page: wpPage(id: { eq: $id }) {
      title
      content
      featuredImage {
        node {
          remoteFile {
            ...HeroImage
          }
        }
      }
      customDisplaySettings {
        statictemplate
      }
      wpParent {
        node {
          ... on WpPage {
            title
            content
          }
        }
      }
    }

    wpCommonSiteSettings {
      title
      customCommonDataFields {
        subheading
        newslettersignupbuttontext
        legalinfo
        address
        contactemail
        donatebuttontext
      }
    }

    nextPage: wpPage(id: { eq: $nextPage }) {
      title
      uri
    }

    previousPage: wpPage(id: { eq: $previousPage }) {
      title
      uri
    }
  }
`;
