const path = require("path")
const fs = require("fs")
const dotenv = require("dotenv")
const mapping = require("./generate-mapping")

exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  const activeEnv =
    process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"
  const env = dotenv.config({ path: `.env.${activeEnv}` }).parsed
  const envKV = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next])
    return prev
  }, {})

  actions.setWebpackConfig({
    plugins: [plugins.define(envKV)],
  })
}

exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  const jsonPagesDir = "./src/models/"
  const template = path.resolve("./src/templates/predictor.jsx")

  fs.readdirSync(jsonPagesDir)
    .filter(jsonFile => {
      const endsInJson = jsonFile.endsWith(".json")
      const fullPath = path.join(jsonPagesDir, jsonFile)
      const isNotDirectory = !fs.statSync(fullPath).isDirectory()

      return endsInJson && isNotDirectory
    })
    .map(jsonFile => {
      const pagePath = path.parse(jsonFile).name
      const fullPath = path.join(jsonPagesDir, jsonFile)
      const pageAsJson = JSON.parse(fs.readFileSync(fullPath), "utf8")
      const features = mapping.generateMappings(pageAsJson)
      const { title, config } = pageAsJson
      const context = {
        id: pagePath,
        isPredictorModel: true,
        title,
        config,
        features,
      }

      return [pagePath, context]
    })
    .forEach(([pagePath, context]) =>
      createPage({
        path: pagePath,
        component: template,
        context,
      })
    )
}
