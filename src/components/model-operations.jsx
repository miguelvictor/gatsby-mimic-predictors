import * as React from "react"
import PropTypes from "prop-types"
import { VictoryChart, VictoryLine, VictoryTheme } from "victory"

import * as modelOperationsStyles from "./model-operations.module.scss"

const ModelOperations = props => {
  const {
    predictions,
    loadSampleFunc,
    resetValuesFunc,
    predictFunc,
    disabled,
  } = props
  const nDays = predictions.length
  const data = predictions.map((pred, i) => ({ x: i + 1, y: pred }))

  return (
    <div className={modelOperationsStyles.container}>
      <div className={modelOperationsStyles.buttons}>
        <button className="button" onClick={loadSampleFunc} disabled={disabled}>
          加载示例
        </button>
        <button
          className="button"
          onClick={resetValuesFunc}
          disabled={disabled}
        >
          重置
        </button>
        <button
          className="button is-primary"
          onClick={predictFunc}
          disabled={disabled}
        >
          预测
        </button>
      </div>
      <VictoryChart
        width={500}
        height={350}
        theme={VictoryTheme.material}
        maxDomain={{ x: nDays, y: 1 }}
        minDomain={{ x: 1, y: 0 }}
      >
        <VictoryLine
          interpolation="monotoneX"
          data={data}
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          }}
          animate={{
            duration: 500,
            onLoad: { duration: 500 },
          }}
        />
      </VictoryChart>
    </div>
  )
}

ModelOperations.propTypes = {
  predictions: PropTypes.arrayOf(PropTypes.number.isRequired),
  loadSampleFunc: PropTypes.func.isRequired,
  resetValuesFunc: PropTypes.func.isRequired,
  predictFunc: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

ModelOperations.defaultProps = {
  predictions: Array(14).fill(0),
  disabled: false,
}

export default ModelOperations
