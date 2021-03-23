import * as React from "react"
import { useState } from "react"
import PropTypes from "prop-types"

import * as featureTableStyles from "./feature-table.module.scss"

const range = n => [...Array(n).keys()]

const FeatureTable = ({ nDays, nFeatures, features }) => {
  // all about state stuff
  const initialData = Array(nDays).fill(Array(nFeatures).fill(3))
  const [featureValues, setFeatureValues] = useState(initialData)

  // subcomponents
  const dayLabels = range(nDays).map(day => (
    <td key={day} className={featureTableStyles.dayHeader}>
      第{day + 1}天
    </td>
  ))
  const featureRows = features.map((feature, featureIndex) => {
    const { id, identifier, label, groupLabel, unit, aggregateType } = feature
    const values = range(nDays).map(day => {
      const cellKey = featureIndex + "-" + day
      return <td key={cellKey}>{featureValues[day][id]}</td>
    })

    return (
      <tr key={identifier}>
        <td className={featureTableStyles.header}>{groupLabel}</td>
        <td className={featureTableStyles.label}>
          {label}&nbsp;
          <span className={featureTableStyles.unit}>{unit}</span>
        </td>
        {values}
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
