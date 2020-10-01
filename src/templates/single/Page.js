import React from "react"
import { graphql } from "gatsby"
import BlogPost from "../../components/template-parts/blog-post"
import Placeholder from "../../components/template-parts/placeholder"
import Homepage from "../../components/template-parts/homepage"

const templates = {
  default: BlogPost,
  homepage: Homepage,
  placeholder: Placeholder,
};

export default ({ data }) => {
  const Template = templates[data.page.customDisplaySettings.statictemplate] || templates.default;
  return <Template data={data} />
};

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
`
