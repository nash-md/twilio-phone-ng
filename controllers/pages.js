const fs = require('fs')
const mustache = require('mustache')
const configuration = require('.././configuration.js')

mustache.tags = ['[[', ']]']

module.exports.home = function (req, res) {
  let user = {
    friendlyName: req.user.friendlyName,
    configuration: { phone: req.user.configuration.phone },
  }

  let page = fs.readFileSync('views/home.html', 'utf8')
  let render = mustache.render(page, { user: JSON.stringify(user) })

  res.status(200).send(render)
}

module.exports.setup = function (req, res) {
  let account = JSON.stringify({
    accountSid: req.user.configuration.decrypted.accountSid,
    authToken: req.user.configuration.decrypted.authToken,
  })

  let phone = JSON.stringify(req.user.configuration.phone)

  let page = fs.readFileSync('views/setup.html', 'utf8')
  let render = mustache.render(page, { phone: phone, account: account })

  res.status(200).send(render)
}

module.exports.index = function (req, res) {
  if (req[configuration.session.name]) {
    res.redirect('/home')
  } else {
    let page = fs.readFileSync('views/login.html', 'utf8')
    let render = mustache.render(page, {})

    res.status(200).send(render)
  }
}
