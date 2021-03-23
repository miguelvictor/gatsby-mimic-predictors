import * as React from "react"
import PropTypes from "prop-types"
import { Link, useStaticQuery, graphql } from "gatsby"

const Header = ({ siteTitle }) => {
  const data = useStaticQuery(graphql`
    query ModelLinksQuery {
      allSitePage(filter: { context: { isPredictorModel: { eq: true } } }) {
        edges {
          node {
            path
            context {
              title
            }
          }
        }
      }
    }
  `)
  const modelLinks = data.allSitePage.edges.map(({ node }) => (
    <Link key={node.path} to={node.path}>
      {node.context.title}
    </Link>
  ))

  return (
    <header
      style={{
        background: `rebeccapurple`,
        marginBottom: `10px`,
      }}
    >
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
        }}
      >
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
        {modelLinks}
      </div>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
