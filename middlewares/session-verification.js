const configuration = require('.././configuration.js')

module.exports.callback = function (req, res, next) {
  if (!req.params.userId) {
    const error = new Error('invalid callback user parameter')
    error.status = 403

    next(error)
  } else {
    req.userId = req.params.userId

    next()
  }
}

module.exports.cookie = function (req, res, next) {
  if (!req[configuration.session.name]) {
    const error = new Error('invalid cookie')
    error.status = 403

    next(error)
  } else {
    req.userId = req[configuration.session.name].userId

    next()
  }
}
