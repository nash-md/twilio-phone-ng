const Ajv = require('ajv')

const ajv = new Ajv()

const LoginRequestSchema = {
  'type': 'object',
  'properties': {
    'user': {
      'type': 'object',
      'properties': {
        'friendlyName': { 'type': 'string', 'minLength': 3, 'maxLength': 40 },
        'password': { 'type': 'string', 'minLength': 3, 'maxLength': 40 },
      },
      'required': ['friendlyName', 'password'],
      'additionalProperties': false,
    },
  },
  'required': ['user'],
  'additionalProperties': false,
}

const validate = ajv.compile(LoginRequestSchema)

module.exports = function (req, res, next) {
  let valid = validate(req.body)

  if (!valid) {
    console.log('json validation failed %j', validate.errors)
    res.status(400).end()
  } else {
    next()
  }
}
