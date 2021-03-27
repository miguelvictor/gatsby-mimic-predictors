import * as React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import PatientsTable from "../components/patients/patients-table"

const Wew = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <PatientsTable />
    </Layout>
  )
}

export default Wew
