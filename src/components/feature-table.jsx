import * as React from "react"
import { useMemo } from "react"
import PropTypes from "prop-types"

import * as featureTableStyles from "./feature-table.module.scss"
import { range } from "../utils"
import { format } from "../formatter"

const FeatureTable = ({ nDays, features, values, weights }) => {
  // format feature values
  const formattedValues = useMemo(() => format(features, values), [
    features,
    values,
  ])

  // subcomponents
  const dayLabels = range(nDays).map(day => (
    <td key={day} className={featureTableStyles.dayHeader}>
      第{day + 1}天
    </td>
  ))
  const featureRows = features.map((feature, featureIndex) => {
    const { id, identifier, label, groupLabel, unit } = feature
    const featureValueCells = range(nDays).map(day => {
      const cellKey = featureIndex + "-" + day
      const weightedBg = `rgba(33, 150, 243, ${weights[day][id]})`
      const tdStyles = { backgroundColor: weightedBg }

      return (
        <td
          key={cellKey}
          style={tdStyles}
          className={featureTableStyles.value}
          title={values[day][id]}
        >
          {formattedValues[day][id]}
        </td>
      )
    })

    return (
      <tr key={identifier}>
        <td className={featureTableStyles.header}>{groupLabel}</td>
        <td className={featureTableStyles.label}>
          {label}&nbsp;
          <span className={featureTableStyles.unit}>{unit}</span>
        </td>
        {featureValueCells}
      </tr>
    )
  })

  return (
    <table className={featureTableStyles.featureTable}>
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
          {dayLabels}
        </tr>
      </thead>
      <tbody>{featureRows}</tbody>
    </table>
  )
}

FeatureTable.propTypes = {
  nDays: PropTypes.number.isRequired,
  nFeatures: PropTypes.number.isRequired,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      identifier: PropTypes.string.isRequired,
      label: PropTypes.string,
      unit: PropTypes.string,
      aggregateType: PropTypes.string,
    }).isRequired
  ).isRequired,
}

export default FeatureTable
