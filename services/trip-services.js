const { Trip } = require('../models')

const tripServices = {
  getTrips: (req, callback) => {
    Trip.findAll({
      raw: true
    })
      .then(trips => callback(null, { trips }))
      .catch(err => callback(err))
  }
}

module.exports = tripServices
