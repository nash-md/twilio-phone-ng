const express = require('express')
const clientSessions = require('client-sessions')
const configuration = require('./configuration.js')
const sessionVerification = require('./middlewares/session-verification.js')
const sessionDecryption = require('./middlewares/session-decryption.js')
const sessionError = require('./middlewares/session-error.js')
const loadUser = require('./middlewares/load-user.js')

const router = express.Router() // eslint-disable-line new-cap

const pages = require('./controllers/pages.js')

router.route('/home').get(clientSessions(configuration.session.options), sessionVerification.cookie, loadUser, sessionDecryption, sessionError.redirect, pages.home)
router.route('/setup').get(clientSessions(configuration.session.options), sessionVerification.cookie, loadUser, sessionDecryption, sessionError.redirect, pages.setup)
router.route('/').get(pages.index)

module.exports = router
