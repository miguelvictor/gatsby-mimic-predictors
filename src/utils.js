export function zeros1d(length) {
  return Array(length).fill(0)
}

export function zeros2d(a1, a2) {
  return Array(a1).fill(Array(a2).fill(0))
}

export function range(end) {
  return Array(end)
    .fill(0)
    .map((_, i) => i)
}

export function getEmptyDayStart(x) {
  const daysNonEmpty = x.map(values => values.some(value => value !== 0))
  const lastNonEmptyDay = daysNonEmpty.lastIndexOf(true)

  return lastNonEmptyDay + 1
}

export function truncatePaddingDays(x) {
  const emptyDayStart = getEmptyDayStart(x)
  const endIndex = Math.max(1, emptyDayStart)
  const truncatedX = x.slice(0, endIndex)

  return truncatedX
}

export function addPaddingDays1d(x, nDays) {
  const nToAddDays = nDays - x.length
  const paddingDays = zeros1d(nToAddDays)
  const paddedX = x.concat(paddingDays)

  return paddedX
}

export function addPaddingDays2d(x, nDays) {
  const nFeatures = x[0].length
  const nToAddDays = nDays - x.length
  const paddingDays = zeros2d(nToAddDays, nFeatures)
  const paddedX = x.concat(paddingDays)

  return paddedX
}
