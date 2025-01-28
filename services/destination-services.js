const { Trip, Destination } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const { dayInterval, timeToUtc } = require('../helpers/dayjs-helper')

const destinationServices = {
  getDestination: (req, callback) => {
    const { id } = req.params
    Destination.findByPk(id, { raw: true })
      .then(destination => {
        if (!destination) throw new Error("The destination doesn't exist!")

        return callback(null, { destination })
      })
      .catch(err => callback(err))
  },
  createDestination: (req, callback) => {
    const id = req.query.trip
    Trip.findByPk(id, { raw: true })
      .then(trip => {
        if (!trip) throw new Error("The trip doesn't exist!")

        return callback(null, { trip })
      })
      .catch(err => callback(err))
  },
  postDestination: (req, callback) => {
    const { name, date, startTime, endTime, cost, address, description, tripId } = req.body
    const { file } = req
    if (!name || !date || !startTime || !endTime) throw new Error('Please complete all required fields')

    Promise.all([Trip.findByPk(tripId), localFileHandler(file)])
      .then(([trip, filePath]) => {
        // 確認時間在trip區間內
        const tripDayCount = dayInterval(trip.startDate, trip.endDate)
        const dayCount = dayInterval(trip.startDate, timeToUtc(date))
        if (dayCount < 1 || dayCount > tripDayCount) throw new Error('Selected date exceeds the travel period!')

        return Destination.create({
          name,
          date,
          startTime,
          endTime,
          cost,
          address,
          description,
          tripId,
          image: filePath || null
        })
      })
      .then(newDestination => callback(null, { newDestination, tripId }))
      .catch(err => callback(err))
  },
  deleteDestination: (req, callback) => {
    const { id } = req.params
    Destination.findByPk(id)
      .then(destination => {
        if (!destination) throw new Error("The destination doesn't exist!")
        const deletedData = destination.toJSON()
        return destination.destroy()
          .then(() => callback(null, { deletedDestination: deletedData }))
          .catch(err => {
            throw new Error(`Failed to delete destination: ${err.message}`)
          })
      })
      .catch(err => callback(err))
  }
}

module.exports = destinationServices
