const express = require('express')
const bodyParser = require('body-parser')
const clientSessions = require('client-sessions')
const configuration = require('./configuration.js')
const validateRegisterRequest = require('./middlewares/json-schema/validate-register-request.js')

const router = express.Router() // eslint-disable-line new-cap

router.use(bodyParser.json({}))
router.use(clientSessions(configuration.session.options))
router.use(validateRegisterRequest)

const register = require('./controllers/register.js')

router.route('/').post(register)

module.exports = router
