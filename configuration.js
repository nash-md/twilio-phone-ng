const configuration = module.exports = {}

configuration.session = {}
configuration.session.name = 'eatyourowndogfood'
configuration.session.options = {
  cookieName: 'eatyourowndogfood',
  secret: process.env.SESSION_SECRET,
  duration: 24 * 60 * 60 * 1000,
  activeDuration: 1000 * 60 * 5,
  cookie: {
    ephemeral: false,
    httpOnly: true,
    secure: false,
  },
}
