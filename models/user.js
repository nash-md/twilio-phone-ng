const mongoose = require('mongoose')
const crypto = require('crypto')

const Schema = mongoose.Schema

function encrypt(key, value) {
  let cipher = crypto.createCipher('aes-256-cbc', key)
  let crypted = cipher.update(value, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function decrypt(key, value) {
  if (value) {
    let decipher = crypto.createDecipher('aes-256-cbc', key)
    let decrypted = decipher.update(value, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
  return null
}

let UserSchema = new Schema({
  friendlyName: String,
  password: String,
  encryption: {
    salt: String,
    key: String,
  },
  configuration: {
    encrypted: {
      accountSid: { type: String, default: '' },
      authToken: { type: String, default: '' },
    },
    decrypted: {},
    twilio: {
      clientName: String,
      applicationSid: { type: String, validate: /$|^AP[a-zA-Z0-9]{32}$/ },
    },
    phone: {
      outbound: {
        isActive: { type: Boolean, default: false },
        mode: { type: String, enum: ['internal-caller-id', 'external-caller-id'] },
        callerId: { type: String, validate: /$|^\+[0-9]{8,20}$/ },
        phoneNumber: { type: String, validate: /$|^\+[0-9]{8,20}$/ },
      },
      inbound: {
        isActive: { type: Boolean, default: false },
        phoneNumber: { type: String, validate: /$|^\+[0-9]{8,20}$/ },
      },
    },
  },
}, {
  versionKey: false,
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret._id
      delete ret.password
      delete ret.encryption
      delete ret.configuration.encrypted
    },
  },
})

UserSchema.methods.getCallerId = function () {
  if (this.configuration.phone.outbound.isActive) {
    if (this.configuration.phone.outbound.mode === 'external-caller-id') {
      return this.configuration.phone.outbound.callerId
    }

    if (this.configuration.phone.outbound.mode === 'internal-caller-id') {
      return this.configuration.phone.outbound.phoneNumber
    }

  }
  return null
}

UserSchema.virtual('configuration.decrypted.accountSid').get(function () {
  if (this.configuration.encrypted.accountSid && this.encryption.key) {
    return decrypt(this.encryption.key, this.configuration.encrypted.accountSid)
  }
  return null
})

UserSchema.virtual('configuration.decrypted.accountSid').set(function (value) {
  this.configuration.encrypted.accountSid = encrypt(this.encryption.key, value)
})

UserSchema.virtual('configuration.decrypted.authToken').get(function () {
  if (this.configuration.encrypted.authToken && this.encryption.key) {
    return decrypt(this.encryption.key, this.configuration.encrypted.authToken)
  }
  return null
})

UserSchema.virtual('configuration.decrypted.authToken').set(function (value) {
  this.configuration.encrypted.authToken = encrypt(this.encryption.key, value)
})

UserSchema.methods.getTrackerUrl = function (req) {
  return `${req.protocol}://${req.hostname}/api/callback/${this._id}/call/track`
}

UserSchema.pre('save', function (next) {
  this.encryption.key = null
  next()
})

module.exports = mongoose.model('User', UserSchema)
