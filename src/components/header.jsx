import * as React from "react"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  spacer: {
    flexGrow: 1,
  },
}))

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)
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
    <MenuItem key={node.path} onClick={() => navigate(node.path)}>
      {node.context.title}
    </MenuItem>
  ))
  const classes = useStyles()
  const handleOpenMenu = event => setAnchorEl(event.currentTarget)
  const handleCloseMenu = () => setAnchorEl(null)

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <StaticImage
            src="../images/project-logo.png"
            width={250}
            quality={40}
            formats={["AUTO", "WEBP", "AVIF"]}
            alt="Logo"
          />
          <div className={classes.spacer}></div>
          <Button onClick={() => navigate("/patients")}>病人表</Button>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleOpenMenu}
          >
            预测疾病模型
            <ArrowDropDownIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            {modelLinks}
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
