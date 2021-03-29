import * as React from "react"

import Layout from "~core/layout"
import SEO from "~core/seo"
import PatientsTable from "~patients/patients-table"

const Wew = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <PatientsTable />
    </Layout>
  )
}

export default Wew
