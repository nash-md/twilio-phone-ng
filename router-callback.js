const express = require('express')
const bodyParser = require('body-parser')
const sessionVerification = require('./middlewares/session-verification.js')
const sessionError = require('./middlewares/session-error.js')
const loadUser = require('./middlewares/load-user.js')

const router = express.Router({ mergeParams: true }) // eslint-disable-line new-cap

router.use(bodyParser.urlencoded({
  extended: true,
}))

router.use(sessionVerification.callback)
router.use(loadUser)
router.use(sessionError.callback)

const phone = require('./controllers/phone.js')

router.route('/outgoing').post(phone.outgoing)
router.route('/incoming').post(phone.incoming)
router.route('/call/track').post(phone.track)

module.exports = router
