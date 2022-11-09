export const notBlank = (value, fieldName) => {
  if (value) {
    return ''
  }
  return `${fieldName} must not be empty.`
}

export const match = ({ value, otherValue }, fieldName) => {
  if (value === otherValue) {
    return ''
  }
  return `${fieldName} must match.`
}

export const email = (value) => {
  const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (emailRex.test(value)) {
    return ''
  }
  return 'Please enter a valid email.'
}

export const password = (value) => {
  // Not sure if this is the right regex
  const passwordRex = /.{8,}/
  if (passwordRex.test(value)) {
    return ''
  }
  return 'Make sure your password is at least eight characters long.'
}
