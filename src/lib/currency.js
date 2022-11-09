export const convert = (value, currency, locales, noSymbol = false) => {
  const convertedValue = value * currency.conversionRate
  const formattedNumber = convertedValue.toLocaleString(locales.languageTag, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  if (noSymbol) return formattedNumber
  return `${formattedNumber} ${currency.symbol}`
}

export const localize = (value, locales, maxDigits = 4, minDigits = 2) => {
  // const roundedValue = Math.round(value * 100) / 100
  const formattedNumber = parseFloat(value).toLocaleString(locales.languageTag, { maximumFractionDigits: maxDigits, minimumFractionDigits: minDigits })
  return formattedNumber
}

export const format = (value, locales, maxDigits = 4) => {
  const number = parseFloat(value)
  const formattedNumber = number.toLocaleString(locales.languageTag, { maximumFractionDigits: maxDigits })
  if (!value) return '0'
  if (value === '.') return '.'
  if (value.slice(-1) === '.') return `${formattedNumber}.`
  if (value.slice(-2) === '.0') return `${formattedNumber}.0`
  if (value.slice(-3) === '.00') return `${formattedNumber}.00`
  if (value.slice(-4) === '.000') return `${formattedNumber}.000`
  if (value.slice(-4) === '.0000') return `${formattedNumber}.0000`
  return formattedNumber.toString()
}

export const formatCoin = (value, decimals, locales, symbol) => {
  let formatted = value / (10 ** decimals)
  if (symbol === 'MLD') formatted = value
  const maximumFractionDigits = (formatted > 1000 || symbol === 'MLD') ? 2 : 5
  formatted = formatted.toLocaleString(locales.languageTag, { maximumFractionDigits })
  return formatted
}
