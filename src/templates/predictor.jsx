import * as React from "react"
import { useState, useEffect, useCallback, useRef } from "react"

import Layout from "~core/layout"
import SEO from "~core/seo"
import FeatureTable from "~shared/feature-table"
import ModelOperations from "~predictors/model-operations"

import { loadSample, predict } from "~root/api"
import { zeros1d, zeros2d } from "~root/utils"

const PredictorTemplate = props => {
  // extract needed data from props
  const { pageContext } = props
  const { id, title, config, features } = pageContext
  const { nDays, nFeatures } = config

  // component state
  const [isLoading, setIsLoading] = useState(false)
  const isMounted = useRef(true)

  // keep model data in this component
  const [values, setValues] = useState(() => zeros2d(nDays, nFeatures))
  const [weights, setWeights] = useState(() => zeros2d(nDays, nFeatures))
  const [predictions, setPredictions] = useState(() => zeros1d(nDays))
  const [model, setModel] = useState("gpt2")

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => (isMounted.current = false)
  }, [])

  // button callback functions definitions
  const changeModelFunc = useCallback(event => {
    setModel(event.target.value)
  }, [])
  const loadSampleFunc = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    const { x } = await loadSample(id, nDays)
    if (isMounted.current) {
      setValues(x)
      setWeights(zeros2d(nDays, nFeatures))
      setPredictions(zeros1d(nDays))
      setIsLoading(false)
    }
  }, [id, isLoading, nDays, nFeatures])
  const resetValuesFunc = useCallback(() => {
    setValues(zeros2d(nDays, nFeatures))
    setWeights(zeros2d(nDays, nFeatures))
    setPredictions(zeros1d(nDays))
  }, [nDays, nFeatures])
  const predictFunc = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    const { predictions, weights: w } = await predict(id, model, values, nDays)
    if (isMounted.current) {
      setPredictions(predictions)
      setWeights(w)
      setIsLoading(false)
    }
  }, [id, isLoading, nDays, values, model])

  // rendering stuff
  return (
    <Layout>
      <SEO title={title}></SEO>
      <ModelOperations
        title={title}
        model={model}
        changeModelFunc={changeModelFunc}
        predictions={predictions}
        loadSampleFunc={loadSampleFunc}
        resetValuesFunc={resetValuesFunc}
        predictFunc={predictFunc}
        disabled={isLoading}
      />
      <FeatureTable
        nDays={nDays}
        nFeatures={nFeatures}
        features={features}
        values={values}
        weights={weights}
      ></FeatureTable>
    </Layout>
  )
}

export default PredictorTemplate
