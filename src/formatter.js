import { getEmptyDayStart } from "./utils"

export function format(features, values) {
  const formattedValues = JSON.parse(JSON.stringify(values))
  const emptyDayStart = getEmptyDayStart(values)

  for (const feature of features) {
    const { id, formatting } = feature

    for (let day = 0; day < values.length; day++) {
      const value = values[day][id]

      if (day >= emptyDayStart) {
        formattedValues[day][id] = "-"
      } else if (formatting === "gender") {
        formattedValues[day][id] = formatGender(value)
      } else if (formatting === "existential") {
        formattedValues[day][id] = formatBooleanHave(value)
      } else if (formatting === "being") {
        formattedValues[day][id] = formatBooleanIs(value)
      } else if (formatting === "temperature") {
        formattedValues[day][id] = formatTemperature(value)
      } else {
        formattedValues[day][id] = formatReal(value)
      }
    }
  }

  return formattedValues
}

function formatReal(value) {
  if (Number.isInteger(value)) {
    return value.toString()
  }

  if (Number.isInteger(value * 10)) {
    return Number(value).toFixed(1)
  }

  return Number(value).toFixed(2)
}

function formatGender(value) {
  return value === 1 ? "男" : value === 0 ? "女" : formatReal(value)
}

function formatBooleanHave(value) {
  return value === 1 ? "有" : value === 0 ? "无" : formatReal(value)
}

function formatBooleanIs(value) {
  return value === 1 ? "是" : value === 0 ? "否" : formatReal(value)
}

function formatTemperature(value) {
  // values greater than 50 should be in fahrenheit
  // so we convert them to celsius
  if (value) {
    value = (value - 32) * (5 / 9)
  }

  return formatReal(value)
}
