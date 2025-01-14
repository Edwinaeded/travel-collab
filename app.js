require('dotenv').config()
const express = require('express')
const { create } = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const path = require('path')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const router = require('./routes')

const app = express()
const port = 3000

const hbs = create({ extname: '.hbs', helpers: handlebarsHelpers })

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(flash())
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_msg')
  res.locals.error_messages = req.flash('error_msg')
  next()
})

app.use(router)

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`)
})

module.exports = app
