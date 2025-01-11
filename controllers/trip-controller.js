const { Trip } = require('../models')

const tripController = {
  getTrips: (req, res, next) => {
    Trip.findAll({
      raw: true
    })
      .then(trips => {
        res.render('trips', { trips })
      })
      .catch(err => next(err))
  }
}

module.exports = tripController
