const express = require('express')
const bodyParser = require('body-parser')
const clientSessions = require('client-sessions')
const configuration = require('./configuration.js')
const sessionVerification = require('./middlewares/session-verification.js')
const sessionDecryption = require('./middlewares/session-decryption.js')
const sessionError = require('./middlewares/session-error.js')
const loadUser = require('./middlewares/load-user.js')

const router = express.Router() // eslint-disable-line new-cap

router.use(bodyParser.json({}))
router.use(clientSessions(configuration.session.options))
router.use(sessionVerification.cookie)
router.use(loadUser)
router.use(sessionDecryption)
router.use(sessionError.json)

const phone = require('./controllers/phone.js')

router.route('/token').post(phone.token)
router.route('/call-history').get(phone.history)

module.exports = router
