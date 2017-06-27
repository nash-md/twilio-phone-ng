const configuration = require('.././configuration.js')

module.exports.callback = function (error, req, res, next) {
  console.log(error)
  res.status(error.status).json({ status: error.status, message: error.message })
}

module.exports.redirect = function (error, req, res, next) {
  console.log(error)
  if (req[configuration.session.name]) {
    req[configuration.session.name].reset()
  }

  res.redirect('/')
}

module.exports.json = function (error, req, res, next) {
  console.log(error)
  if (req[configuration.session.name]) {
    req[configuration.session.name].reset()
  }

  res.status(error.status).json({ status: error.status, message: error.message })
}
