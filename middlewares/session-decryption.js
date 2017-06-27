const configuration = require('.././configuration.js')

module.exports = function (req, res, next) {
  if (req[configuration.session.name].key) {
    req.user.encryption.key = req[configuration.session.name].key

    return next()
  }

  let error = new Error('error retrieving user')
  error.status = 404

  return next(error)
}
