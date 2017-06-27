const express = require('express')
const bodyParser = require('body-parser')
const clientSessions = require('client-sessions')
const configuration = require('./configuration.js')
const validateLoginRequest = require('./middlewares/json-schema/validate-login-request.js')

const router = express.Router() // eslint-disable-line new-cap

router.use(bodyParser.json({}))
router.use(clientSessions(configuration.session.options))
router.use(validateLoginRequest)

const login = require('./controllers/login.js')

router.route('/').post(login)

module.exports = router
