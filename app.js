const express = require('express')
const { create } = require('express-handlebars')
const handlebarsHelpers = require('./helpers/handlebars-helpers')

const app = express()
const port = 3000

const hbs = create({ extname: '.hbs', helpers: handlebarsHelpers })

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`)
})

module.exports = app
