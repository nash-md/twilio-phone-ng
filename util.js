module.exports.convertErrorToString = function convertErrorToString(error) {
  if (error instanceof Error) {
    return JSON.stringify(error, Object.getOwnPropertyNames(error))
  }

  return JSON.stringify(error)
}
