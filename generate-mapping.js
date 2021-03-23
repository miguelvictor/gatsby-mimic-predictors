const PropTypes = require("prop-types")

// shape definition of each model page's json
const pagePropTypes = {
  title: PropTypes.string.isRequired,
  config: PropTypes.shape({
    nDays: PropTypes.number.isRequired,
    nFeatures: PropTypes.number.isRequired,
  }).isRequired,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      unit: PropTypes.string,
      aggregateType: PropTypes.oneOf(["max", "min", "std"]),
    }).isRequired
  ).isRequired,
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      features: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }).isRequired
  ).isRequired,
}

// monkey-patch `checkPropTypes` function because it doesn't
// throw errors but only logs to console.error instead
PropTypes.originalCheckPropTypes = PropTypes.checkPropTypes
PropTypes.checkPropTypes = function (
  propTypes,
  attrs,
  attrsName,
  componentName
) {
  const consoleError = console.error
  console.error = function (message) {
    throw new Error(message)
  }
  PropTypes.originalCheckPropTypes(propTypes, attrs, attrsName, componentName)
  console.error = consoleError
}

// function used to verify the json shape of each model
// throws error when invalid values are encountered
function verifyShape(pageAsJson, excludeAggregateFeatures) {
  // verify json structure and value types
  // process.env.NODE_ENV = "production"
  PropTypes.checkPropTypes(pagePropTypes, pageAsJson, "prop", "mapping")

  // title should not be empty
  const { title } = pageAsJson
  if (title.trim().length < 1) {
    throw "Empty 'title'"
  }

  // nDays should be a positive integer
  const { nDays } = pageAsJson.config
  if (!Number.isSafeInteger(nDays) || nDays < 1) {
    throw "Invalid 'config.nDays'"
  }

  // nFeatures should be a positive integer
  const { nFeatures } = pageAsJson.config
  if (!Number.isSafeInteger(nFeatures) || nFeatures < 1) {
    throw "Invalid 'config.nFeatures'"
  }

  // make sure all identifiers in `features` are unique
  const { features } = pageAsJson
  const uniqueFeatureIdentifiers = new Set()
  for (const feature of features) {
    if (uniqueFeatureIdentifiers.has(feature.identifier)) {
      throw `Duplicate identifier: ${feature.identifier}`
    }
    uniqueFeatureIdentifiers.add(feature.identifier)
  }

  // make sure all identifiers used in `groups` doesn't contain duplicates
  const { groups } = pageAsJson
  const uniqueGroupIdentifiers = new Set()
  for (const group of groups) {
    for (const feature of group.features) {
      if (uniqueGroupIdentifiers.has(feature)) {
        throw `Duplicate identifier in group '${group.label}': ${feature}`
      }
      uniqueGroupIdentifiers.add(feature)
    }
  }

  // make sure all identifiers used in `groups` really
  // do exist in the `features` definition
  for (const identifier of uniqueGroupIdentifiers) {
    if (!uniqueFeatureIdentifiers.has(identifier)) {
      throw `Unknown feature used in groups: ${identifier}`
    }
  }

  // make sure all features are included in a group
  if (excludeAggregateFeatures) {
    // if aggregated feature values are excluded (e.g., with min/max/std suffixes)
    // it is okay to not include them in the groups
    for (const feature of uniqueFeatureIdentifiers) {
      if (
        feature.endsWith("_min") ||
        feature.endsWith("_max") ||
        feature.endsWith("_std")
      ) {
        uniqueFeatureIdentifiers.delete(feature)
      }
    }
  }
  const unusedFeatures = [...uniqueFeatureIdentifiers].filter(
    x => !uniqueGroupIdentifiers.has(x)
  )
  if (unusedFeatures.length !== 0) {
    throw `There are unused features: ${unusedFeatures}`
  }
}

function generateMappings(pageAsJson, excludeAggregateFeatures = true) {
  verifyShape(pageAsJson, excludeAggregateFeatures)

  // generate feature dictionary
  const featureMap = pageAsJson.features.reduce((acc, feature, index) => {
    const featureViewModel = { ...feature, id: index }

    return { ...acc, [feature.identifier]: featureViewModel }
  }, {})

  // collate features and attach indices
  const groups = pageAsJson.groups
    .map(group => {
      const { label, features } = group

      // attach group label to each feature (only the first feature in the group)
      return features.map((featureIdentifier, index) => ({
        ...featureMap[featureIdentifier],
        groupLabel: index === 0 ? label : null,
      }))
    })
    .flat()

  return groups
}

module.exports = { generateMappings }
