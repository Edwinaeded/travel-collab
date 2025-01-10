const express = require('express')
const router = express.Router()

router.get('/trips', (req, res) => {
  res.render('trips')
})

router.use('/', (req, res) => {
  res.redirect('/trips')
})

module.exports = router
