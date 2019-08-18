/************************************************
 * Get and handle error messages
 ************************************************/
export const parseError = err => {
  let message = err || ''
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err)
        break
      default:
        message = err.errmsg || 'Something went wrong'
    }
  } else if (err.message && !err.errors) {
    message = err.message
  } else {
    for (const errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message
      }
    }
  }
  return message
}

/************************************************
 * Get and handle error messages
 ************************************************/
function getUniqueErrorMessage(err) {
  let output
  try {
    let begin = 0
    if (err.errmsg.lastIndexOf('.$') !== -1) {
      begin = err.errmsg.lastIndexOf('.$') + 2
    } else {
      begin = err.errmsg.lastIndexOf('index: ') + 7
    }
    const fieldName = err.errmsg.substring(begin, err.errmsg.lastIndexOf('_1'))
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists'
  } catch (e) {
    output = 'Unique field already exists'
  }
  return output
}