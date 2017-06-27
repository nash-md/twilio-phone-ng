const mongoose = require('mongoose')
const User = require('./../models/user.js')

module.exports = function (req, res, next) {
  if (mongoose.Types.ObjectId.isValid(req.userId) !== true) {
    let error = new Error('invalid user id')
    error.status = 403

    return next(error)
  }

  return User.findOne({ _id: req.userId }).then(function (user) {
    let error

    if (!user) {
      error = new Error('user not found')
      error.status = 404

      return next(error)
    }

    req.user = user

    return next()
  }).catch(function (error) {
    error = new Error('error retrieving user')
    error.status = 404

    return next(error)
  })
}
