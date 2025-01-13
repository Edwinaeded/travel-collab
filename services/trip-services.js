const { Trip } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const tripServices = {
  getTrips: (req, callback) => {
    Trip.findAll({
      raw: true
    })
      .then(trips => callback(null, { trips }))
      .catch(err => callback(err))
  },
  postTrip: (req, callback) => {
    const { name, startDate, endDate, description } = req.body
    const { file } = req
    if (!name || !startDate || !endDate) throw new Error('Please complete all required fields')

    Promise.all([
      localFileHandler(file),
      Trip.findOne({ where: { name } })
    ])
      .then(([filePath, trip]) => {
        if (trip) throw new Error('This trip already exists!')
        return Trip.create({
          name,
          startDate,
          endDate,
          description,
          image: filePath || null
        })
      })
      .then(newTrip => callback(null, { newTrip, name }))
      .catch(err => callback(err))
  }
}

module.exports = tripServices
