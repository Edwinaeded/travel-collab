const { Trip } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const { getPagination } = require('../helpers/pagination-helpers')

const tripServices = {
  getTrips: (req, callback) => {
    const limit = 8
    const page = Number(req.query.page) || 1
    const offset = (page - 1) * limit

    Trip.findAndCountAll({
      raw: true,
      limit,
      offset
    })
      .then(trips => {
        const pagination = getPagination(trips.count, limit, offset)
        const data = trips.rows.map(trip => ({
          ...trip,
          description: trip.description.substring(0, 50)
        }))
        callback(null, { trips: data, ...pagination })
      })
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
  },
  editTrip: (req, callback) => {
    const { id } = req.params
    Trip.findOne({ where: { id }, raw: true })
      .then(trip => {
        if (!trip) throw new Error("The trip doesn't exist!")

        callback(null, { trip })
      })
      .catch(err => callback(err))
  },
  putTrip: (req, callback) => {
    const { id } = req.params
    const { name, startDate, endDate, description } = req.body
    const { file } = req
    if (!name || !startDate || !endDate) throw new Error('Please complete all required fields')

    Promise.all([
      localFileHandler(file),
      Trip.findByPk(id)
    ])
      .then(([filePath, trip]) => {
        if (!trip) throw new Error("The trip doesn't exists!")
        return trip.update({
          name,
          startDate,
          endDate,
          description,
          image: filePath || trip.image
        })
      })
      .then(trip => callback(null, { trip }))
      .catch(err => callback(err))
  },
  deleteTrip: (req, callback) => {
    const { id } = req.params
    Trip.findByPk(id)
      .then(trip => {
        if (!trip) throw new Error("The trip doesn't exists!")
        return trip.destroy()
      })
      .then(deletedTrip => callback(null, { deletedTrip }))
      .catch(err => callback(err))
  }
}

module.exports = tripServices
