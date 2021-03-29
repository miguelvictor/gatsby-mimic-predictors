import {
  truncatePaddingDays,
  addPaddingDays1d,
  addPaddingDays2d,
} from "./utils"

export async function loadSample(target, nDays = 14) {
  const url = `${process.env.API_URL}/load-sample`
  const params = new URLSearchParams({ target })
  const response = await fetch(url + "?" + params)
  const data = await response.json()

  // the API server only returns the days with actual data
  // but the UI displays up to `nDays` days, so we pad them
  data.x = addPaddingDays2d(data.x, nDays)

  return data
}

export async function predict(target, architecture, x, nDays = 14) {
  const url = `${process.env.API_URL}/predict`
  const truncatedX = truncatePaddingDays(x)
  const body = JSON.stringify({ target, architecture, x: truncatedX })
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
  const data = await response.json()

  // add padding days to response data
  data.predictions = addPaddingDays1d(data.predictions, nDays)
  data.weights = addPaddingDays2d(data.weights, nDays)

  return data
}

export async function getPatients() {
  const url = `${process.env.API_URL}/patients`
  const response = await fetch(url)
  const data = await response.json()

  return data
}
