const bcrypt = require('bcrypt')
const configuration = require('.././configuration.js')
const User = require('.././models/user.js')

module.exports = function (req, res) {

  User.findOne({ friendlyName: req.body.user.friendlyName }).then(function (user) {
    if (!user) {
      res.status(404).end()
      return
    }

    if (bcrypt.compareSync(req.body.user.password, user.password) === true) {
      let key = bcrypt.hashSync(req.body.user.password, user.encryption.salt)

      req[configuration.session.name].userId = user._id
      req[configuration.session.name].key = key
      res.status(200).end()
    } else {
      res.status(404).end()
    }

  }).catch(function (error) {
    console.log(error)
    res.status(500).end()
  })

}
