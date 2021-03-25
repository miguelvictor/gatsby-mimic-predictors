import * as React from "react"
import PropTypes from "prop-types"
import { Link, useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

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
    <Link key={node.path} to={node.path} className="navbar-item">
      {node.context.title}
    </Link>
  ))

  return (
    <nav
      className="navbar has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="https://bulma.io">
          <StaticImage
            src="../images/project-logo.png"
            width={250}
            quality={40}
            formats={["AUTO", "WEBP", "AVIF"]}
            alt="Logo"
          />
        </a>
      </div>
      <div className="navbar-end">
        <Link className="navbar-item" to="/patients">
          病人表
        </Link>
        <div className="navbar-item has-dropdown is-hoverable">
          <a className="navbar-link" href="#">
            预测疾病模型
          </a>

          <div className="navbar-dropdown is-right">
            {modelLinks}
            <hr className="navbar-divider" />
            <a className="navbar-item" href="#">
              怎么添加新的模型
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
