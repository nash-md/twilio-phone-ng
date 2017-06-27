const Ajv = require('ajv')

const ajv = new Ajv()

const RegisterRequestSchema = {
  'type': 'object',
  'properties': {
    'user': {
      'type': 'object',
      'properties': {
        'friendlyName': { 'type': 'string', 'minLength': 3, 'maxLength': 20 },
        'password': { 'type': 'string', 'minLength': 3, 'maxLength': 20 },
      },
      'required': ['friendlyName', 'password'],
      'additionalProperties': false,
    },
  },
  'required': ['user'],
  'additionalProperties': false,
}

const validate = ajv.compile(RegisterRequestSchema)

module.exports = function (req, res, next) {
  let valid = validate(req.body)

  if (!valid) {
    console.log('json validation failed %j', validate.errors)
    res.status(400).end()
  } else {
    next()
  }
}
