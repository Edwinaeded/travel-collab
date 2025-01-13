const { Trip } = require('../models')

const tripServices = {
  getTrips: (req, callback) => {
    Trip.findAll({
      raw: true
    })
      .then(trips => callback(null, { trips }))
      .catch(err => callback(err))
  },
  postTrip: (req, callback) => {
    const { name, startDate, endDate, description, image } = req.body
    if (!name || !startDate || !endDate) throw new Error('Please complete all required fields')

    Trip.findOne({ where: { name } })
      .then(trip => {
        if (trip) throw new Error('This trip already exists!')
        return Trip.create({ name, startDate, endDate, description, image })
      })
      .then(newTrip => callback(null, { newTrip, name }))
      .catch(err => callback(err))
  }
}

module.exports = tripServices
