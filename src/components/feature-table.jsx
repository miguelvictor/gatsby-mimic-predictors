import * as React from "react"
import { useMemo, useCallback } from "react"
import PropTypes from "prop-types"

import { AgGridColumn, AgGridReact } from "ag-grid-react"
import "./feature-table.theme.scss"

import { range } from "../utils"
import { format } from "../formatter"

const FeatureTable = ({ nDays, features, values, weights }) => {
  // format feature values
  const formattedValues = useMemo(() => format(features, values), [
    features,
    values,
  ])

  // cell custom renderers
  const labelRenderer = useCallback(
    params => {
      const { value, rowIndex } = params
      const { unit } = features[rowIndex]

      return unit ? `${value}<span class="unit">${unit}</span>` : value
    },
    [features]
  )
  const valueRenderer = useCallback(params => {
    const { value, eGridCell } = params
    const { value: featureValue, weight } = value

    if (weight > 0) {
      eGridCell.style.backgroundColor = `rgba(33, 150, 243, ${weight})`
    } else {
      eGridCell.style.backgroundColor = null
    }

    return featureValue
  }, [])

  // column types definition
  const columnTypes = useMemo(
    () => ({
      groupLabelColumn: {
        width: 85,
      },
      labelColumn: {
        width: 120,
      },
      valueColumn: {
        width: 55,
      },
    }),
    []
  )
  const domLayout = features.length <= 25 ? "autoHeight" : undefined
  const widthOffset = nDays >= 14 ? 20 : 5
  const dimensions = {
    width:
      columnTypes.groupLabelColumn.width +
      columnTypes.labelColumn.width +
      columnTypes.valueColumn.width * nDays +
      widthOffset,
    height: domLayout ? undefined : "100%",
  }

  // cell values
  const dayColumns = useMemo(
    () =>
      range(nDays).map(day => (
        <AgGridColumn
          key={day}
          headerName={`第${day + 1}天`}
          field={`day${day}`}
          type="valueColumn"
          cellRenderer={valueRenderer}
        />
      )),
    [nDays, valueRenderer]
  )
  const rowData = useMemo(() => {
    console.log("new weights")
    console.log(weights)
    return features.map(feature => {
      const { id, label, groupLabel } = feature
      const dayValues = range(nDays)
        .map(day => ({
          [`day${day}`]: {
            value: formattedValues[day][id],
            weight: weights[day][id],
          },
        }))
        .reduce((acc, val) => ({ ...acc, ...val }), {})

      return { groupLabel, label, ...dayValues }
    })
  }, [nDays, features, formattedValues, weights])

  return (
    <div className="ag-theme-alpine" style={dimensions}>
      <AgGridReact
        columnTypes={columnTypes}
        rowData={rowData}
        domLayout={domLayout}
        style={{
          width: dimensions.width - widthOffset,
          height: dimensions.height,
        }}
      >
        <AgGridColumn
          headerName=""
          field="groupLabel"
          type="groupLabelColumn"
        />
        <AgGridColumn
          headerName=""
          field="label"
          type="labelColumn"
          cellRenderer={labelRenderer}
        />
        {dayColumns}
      </AgGridReact>
    </div>
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
