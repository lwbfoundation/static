import React, { ComponentType, FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import BlogPost from '../../components/template-parts/blog-post';
import Placeholder from '../../components/template-parts/placeholder';
import Homepage from '../../components/template-parts/homepage';

export interface PageTemplateProps {
  data: PageQueryResult;
}

type PageTemplate = ComponentType<PageTemplateProps>;

const templates: { [key: string]: PageTemplate } = {
  default: BlogPost,
  homepage: Homepage,
  placeholder: Placeholder,
};

interface GeneralSettings {
  readonly title: string;
}

interface Wp {
  readonly generalSettings: GeneralSettings;
}

interface CustomDisplaySettings {
  readonly statictemplate: string;
}

interface CustomHomepageOptions {
  readonly subheading: string;
  readonly donatebuttontext: string;
  readonly legalinfo: string;
}

interface Page {
  readonly uri: string;
  readonly title: string;
  readonly content: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly featuredImage: any;
  readonly customDisplaySettings: CustomDisplaySettings;
  readonly customHomepageOptions: CustomHomepageOptions;
}

interface PageQueryResult {
  wp: Wp;
  page: Page;
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
    wp {
      generalSettings {
        title
      }
    }

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
      customHomepageOptions {
        subheading
        donatebuttontext
        legalinfo
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
