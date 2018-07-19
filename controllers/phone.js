const twilio = require('twilio')
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const Call = require('.././models/call.js')

module.exports.incoming = function (req, res) {
  if (!req.body.To || req.body.To.length === 0) {
    res.status(500).end()
    return
  }

  console.log('number to call: %s', req.body.To)

  let twiml = new VoiceResponse()
  
  const dial = twiml.dial();

  dial.client(
    {
      statusCallbackEvent: 'ringing answered completed',
      statusCallbackMethod: 'POST',
      statusCallback: req.user.getTrackerUrl(req),
    }, req.user.configuration.twilio.clientName)

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=0')

  res.status(200).send(twiml.toString())
}

module.exports.outgoing = function (req, res) {
  let twiml = new VoiceResponse()

  const dial = twiml.dial( { callerId: req.user.getCallerId() });

  dial.number({
    statusCallbackEvent: 'ringing answered completed',
    statusCallbackMethod: 'POST',
    statusCallback: req.user.getTrackerUrl(req),
  }, req.body.PhoneNumber)

  res.setHeader('Content-Type', 'application/xml')
  res.setHeader('Cache-Control', 'public, max-age=0')

  res.status(200).send(twiml.toString())
}

module.exports.track = function (req, res) {
  if (req.body.From === ('client: %s', req.user.configuration.twilio.clientName)) {
    // this is the client leg for outbound  we dont want this in our log
    res.setHeader('Content-Type', 'application/xml')
    res.status(200).end()
    return
  }

  /* we don't need this leg we are just interested in the
  connection time an status of the leg twilio --> client */
  if (req.body.To === req.user.configuration.phone.inbound.phoneNumber) {
    console.log('this is the pstn inbound leg phone we dont want this in our log')
    res.setHeader('Content-Type', 'application/xml')
    res.status(200).end()
    return

  }

  let call = {}

  call.sid = req.body.CallSid
  call.from = req.body.From
  call.to = req.body.To
  call.userId = req.user._id
  call.status = req.body.CallStatus

  if (req.body.To && req.body.To === (`client:${req.user.configuration.twilio.clientName}`)) {
    call.direction = 'inbound'
  } else {
    call.direction = 'outbound'
  }

  if (req.body.CallDuration) {
    call.duration = parseInt(req.body.CallDuration, 10)
  }

  Call.findOneAndUpdate({
    'sid': req.body.CallSid,
  },
    call, {
      new: true,
      upsert: true,
      runValidators: true,
    }).then(function (callStored) {
      console.log(`stored call event ${callStored.status}, id is ${callStored._id}`)

      res.setHeader('Content-Type', 'application/xml')
      res.status(200).end()
    }).catch(function (error) {
      console.log(error)
      res.setHeader('Content-Type', 'application/xml')
      res.status(500).end()
    })

}

module.exports.history = function (req, res) {
  let start = parseInt(req.query.start, 10) || 0

  let query = {
    start: start,
    limit: 10,
    refresh: false,
    more: false,
    timestamp: null,
  }

  return new Promise(function (resolve, reject) {

    if (req.query.timestamp) {
      console.log('timestamp set, check if there was any update since: %s', req.query.timestamp)

      Call.count({ 'userId': req.user._id, updatedAt: { '$gte': new Date(req.query.timestamp) } }).then(function (count) {
        /* the call history was updated in the meantime */
        if (count > 0) {
          query.limit = query.start + query.limit
          query.start = 0
          query.refresh = true
        }

        resolve()
      }).catch(function (error) {
        reject()
      })

    } else {
      resolve()
    }

  }).then(function (result) {

    return Call.find({ 'userId': req.user._id })
      .sort({ updatedAt: 'desc' })
      .skip(query.start)
      .limit((query.limit + 1))

  }).then(function (calls) {
    if (calls && calls.length === (query.limit + 1)) {
      calls.pop()
      query.more = true
    }

    query.timestamp = new Date()

    res.status(200).json({ query: query, calls: calls })

  }).catch(function (error) {
    console.log(error)
    res.status(500).end()
  })
}

module.exports.token = function (req, res) {
  const ClientCapability = twilio.jwt.ClientCapability

  const capability = new ClientCapability({
    accountSid: req.user.configuration.decrypted.accountSid,
    authToken: req.user.configuration.decrypted.authToken,
    ttl: 1200
  })

  if (req.user.configuration.phone.inbound.isActive === true) {
    capability.addScope(
      new ClientCapability.IncomingClientScope(req.user.configuration.twilio.clientName)
    )
  }

  if (req.user.configuration.phone.outbound.isActive === true) {
    capability.addScope(
      new ClientCapability.OutgoingClientScope({
        applicationSid: req.user.configuration.twilio.applicationSid,
        clientName: req.user.configuration.twilio.clientName
      })
    )
  }

  const token = { token: capability.toJwt() }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'public, max-age=0')
  res.status(200).send(JSON.stringify(token, null, 3))
}