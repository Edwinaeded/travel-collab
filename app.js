require('dotenv').config()
const express = require('express')
const redis = require('redis')
const { create } = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport')
const path = require('path')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helper')
const router = require('./routes')

const app = express()
const client = redis.createClient()
const port = process.env.PORT || 3000

const hbs = create({ extname: '.hbs', helpers: handlebarsHelpers })
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(flash())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_msg')
  res.locals.error_messages = req.flash('error_msg')
  res.locals.user = getUser(req)
  next()
})

app.use(router)

async function startServer () {
  try {
    // 開啟redis連線
    await client.connect()
    console.log('Redis connected')

    // 綁定client供全域使用
    app.locals.redisClient = client

    // app啟動
    app.listen(port, () => {
      console.log(`app is running on http://localhost:${port}`)
    })
  } catch (err) {
    console.error('Error starting server:', err)
  }
}
startServer()

module.exports = app
