const tripServices = require('../services/trip-services')

const tripController = {
  getTrips: (req, res, next) => {
    tripServices.getTrips(req, (err, data) => err ? next(err) : res.render('trips', data))
  },
  createTrip: (req, res, next) => {
    try {
      res.render('create-trip')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tripController
