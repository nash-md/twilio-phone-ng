const twilio = require('twilio')
const util = require('../util.js')
const configuration = require('.././configuration.js')

const createOrUpdateApplication = function (req, client) {
  let voiceUrl = `${req.protocol}://${req.hostname}/api/callback/${req.user._id}/outgoing`

  if (req.user.configuration.twilio.applicationSid) {

    return client.applications(req.user.configuration.twilio.applicationSid).update({
      friendlyName: 'Twilio Phone Demo',
      voiceUrl: voiceUrl,
      voiceMethod: 'POST',
    })

  }

  return client.applications.create({
    friendlyName: 'Twilio Phone Demo',
    voiceUrl: voiceUrl,
    voiceMethod: 'POST',
  })

}

const updateInboundPhoneNumber = function (req, client) {

  return client.incomingPhoneNumbers
    .list({ phoneNumber: req.user.configuration.phone.inbound.phoneNumber })
    .then(function (incomingPhoneNumbers) {

      if (incomingPhoneNumbers.length === 1) {
        const voiceUrl = `${req.protocol}://${req.hostname}/api/callback/${req.user._id}/incoming`

        return client.incomingPhoneNumbers(incomingPhoneNumbers[0].sid).update({
          voiceUrl: voiceUrl,
          voiceMethod: 'POST',
        })

      }

      return Promise.reject('more than one phone number found')
    })

}

module.exports.updatePhone = function (req, res) {
  console.log('update phone configuration: %j', req.body)

  let client = twilio(req.user.configuration.decrypted.accountSid,
                      req.user.configuration.decrypted.authToken)

  req.user.configuration.phone = req.body.phone

  return new Promise(function (resolve, reject) {
    if (req.user.configuration.phone.outbound.isActive) {

      createOrUpdateApplication(req, client).then(function (application) {
        req.user.configuration.twilio.applicationSid = application.sid
        resolve()
      }).catch(function (error) {
        console.log(error)
        reject(error)
      })

    } else {
      resolve()
    }
  }).then(function (result) {

    return new Promise(function (resolve, reject) {
      if (req.user.configuration.phone.inbound.isActive) {

        updateInboundPhoneNumber(req, client).then(function (phoneNumber) {
          resolve()
        }).catch(function (error) {
          reject(error)
        })

      } else {
        resolve()
      }
    })

  }).then(function () {
    let clientName = req.user.friendlyName.toLowerCase()

    clientName = clientName.replace(/[^a-z0-9 ]/g, '')
    clientName = clientName.replace(/[ ]/g, '_')

    req.user.configuration.twilio.clientName = clientName
    req.user.configuration.phone = req.body.phone

    return req.user.save()
  }).then(function (user) {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).end()
  }).catch(function (error) {
    res.setHeader('Content-Type', 'application/json')
    res.status(500).send(util.convertErrorToString(error))
  })
}

module.exports.updateAccount = function (req, res) {
  req.user.configuration.decrypted.accountSid = req.body.accountSid
  req.user.configuration.decrypted.authToken = req.body.authToken

  req.user.save().then(function (user) {
    /* re-inject key */
    user.encryption.key = req[configuration.session.name].encryptionKey

    res.setHeader('Content-Type', 'application/json')
    res.status(200).end()
  }).catch(function (error) {
    console.log(error)
    res.setHeader('Content-Type', 'application/json')
    res.status(500).send(util.convertErrorToString(error))
  })

}

module.exports.validateAccount = function (req, res) {
  let client = twilio(req.body.accountSid, req.body.authToken)

  client.api.accounts(req.body.accountSid).fetch()
  .then((account) => {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).end()
  }).catch(function (error) {
    res.setHeader('Content-Type', 'application/json')
    res.status(500).send(util.convertErrorToString(error))
  })

}

module.exports.getCallerIds = function (req, res) {
  let client = twilio(req.user.configuration.decrypted.accountSid,
                      req.user.configuration.decrypted.authToken)

  Promise.all([fetchAllIncomingPhoneNumbers(client), fetchAllOutgoingCallerIds(client)]).then((values) => {
    console.log(values);

    let payload = {
      incomingPhoneNumbers: values[0],
      outgoingCallerIds: values[1],
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(payload)
  }).catch((error) => {
    
    res.setHeader('Content-Type', 'application/json')
    res.status(500).send(util.convertErrorToString(error))
  })

}

const fetchAllIncomingPhoneNumbers = (client) => {
  return new Promise((resolve, reject) => {

    client.incomingPhoneNumbers.list().then((phoneNumbers) => {
  
      return phoneNumbers
        .filter(phoneNumber => phoneNumber.capabilities.voice)
        .map((phoneNumber) => {
          return {
            phoneNumber: phoneNumber.phoneNumber,
            friendlyName: phoneNumber.friendlyName
          }
        })

      }).then(list => resolve(list)).catch(error => reject(error))

  })
}

const fetchAllOutgoingCallerIds = (client) => {
  return new Promise((resolve, reject) => {

    client.outgoingCallerIds.list().then((callerIds) => {
  
      return callerIds.map((callerId) => {
        return { phoneNumber: callerId.phoneNumber, friendlyName: callerId.friendlyName }
      })
    
    }).then(list => resolve(list)).catch(error => reject(error))
  
  })
}

  