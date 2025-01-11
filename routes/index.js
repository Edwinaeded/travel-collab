const express = require('express')
const router = express.Router()
const tripController = require('../controllers/trip-controller')

router.get('/trips', tripController.getTrips)

router.use('/', (req, res) => {
  res.redirect('/trips')
})

module.exports = router
