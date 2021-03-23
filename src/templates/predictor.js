import * as React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import FeatureTable from "../components/feature-table"

const PredictorTemplate = props => {
  // react component stuff
  const { pageContext } = props
  const { title, config, features } = pageContext
  const { nDays, nFeatures } = config

  // rendering stuff
  return (
    <Layout>
      <SEO title={title}></SEO>
      <FeatureTable
        nDays={nDays}
        nFeatures={nFeatures}
        features={features}
      ></FeatureTable>
    </Layout>
  )
}

export default PredictorTemplate
