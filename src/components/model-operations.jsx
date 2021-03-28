import * as React from "react"
import PropTypes from "prop-types"

import { VictoryChart, VictoryLine, VictoryTheme } from "victory"
import Button from "@material-ui/core/Button"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"

import * as styles from "./model-operations.module.scss"

const ModelOperations = props => {
  const {
    title,
    predictions,
    loadSampleFunc,
    resetValuesFunc,
    predictFunc,
    disabled,
    model,
    changeModelFunc,
  } = props
  const nDays = predictions.length
  const data = predictions.map((pred, i) => ({ x: i + 1, y: pred }))

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
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
      <div className={styles.buttons}>
        <Button variant="outlined" onClick={loadSampleFunc} disabled={disabled}>
          加载示例
        </Button>
        <Button
          variant="outlined"
          onClick={resetValuesFunc}
          disabled={disabled}
        >
          重置
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={predictFunc}
          disabled={disabled}
        >
          预测
        </Button>
      </div>
      <div className={styles.modelChooser}>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="model architecture"
            name="architecture"
            value={model}
            onChange={changeModelFunc}
          >
            <FormControlLabel
              value="gpt2"
              control={<Radio color="primary" />}
              label="GPT-2"
            />
            <FormControlLabel
              value="lstm"
              control={<Radio color="primary" />}
              label="LSTM"
            />
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  )
}

ModelOperations.propTypes = {
  title: PropTypes.string.isRequired,
  predictions: PropTypes.arrayOf(PropTypes.number.isRequired),
  loadSampleFunc: PropTypes.func.isRequired,
  resetValuesFunc: PropTypes.func.isRequired,
  predictFunc: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  model: PropTypes.string.isRequired,
  changeModelFunc: PropTypes.func.isRequired,
}

ModelOperations.defaultProps = {
  predictions: Array(14).fill(0),
  disabled: false,
}

export default ModelOperations
