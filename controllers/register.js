const bcrypt = require('bcrypt')
const configuration = require('.././configuration.js')
const User = require('.././models/user.js')

module.exports = function (req, res) {

  User.findOne({ friendlyName: req.body.user.friendlyName }).then(function (user) {
    if (user) {
      res.status(409).end()
    } else {
      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(req.body.user.password, salt)

      user = new User()
      user.friendlyName = req.body.user.friendlyName
      user.password = hash
      user.encryption.salt = bcrypt.genSaltSync(10)

      user.save().then(function () {
        let key = bcrypt.hashSync(req.body.user.password, user.encryption.salt)

        req[configuration.session.name].userId = user._id
        req[configuration.session.name].key = key
        res.status(200).end()
      }).catch(function (error) {
        console.log(error)
        res.status(500).end()
      })

    }
  }).catch(function (error) {
    res.status(500).end()
  })

}
