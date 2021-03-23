const path = require("path")
const fs = require("fs")
const mapping = require("./generate-mapping")

exports.createPages = async ({ actions }) => {
  const { createPage } = actions
  const jsonPagesDir = "./src/models/"
  const template = path.resolve("./src/templates/predictor.js")

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
      const context = { title, config, features, isPredictorModel: true }

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
