const { Trip, Destination } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const { dayInterval, timeToUtc } = require('../helpers/dayjs-helper')
const { getUser } = require('../helpers/auth-helper')

const destinationServices = {
  getDestination: (req, callback) => {
    const { id } = req.params
    const user = getUser(req)

    Destination.findByPk(id, {
      include: Trip,
      raw: true,
      nest: true
    })
      .then(destination => {
        if (!destination) throw new Error("The destination doesn't exist!")
        if (destination.Trip.userId !== user.id) throw new Error('Permission denied!')
        return callback(null, { destination })
      })
      .catch(err => callback(err))
  },
  createDestination: (req, callback) => {
    const id = req.query.trip
    const user = getUser(req)

    Trip.findByPk(id, { raw: true })
      .then(trip => {
        if (!trip) throw new Error("The trip doesn't exist!")
        if (trip.userId !== user.id) throw new Error('Permission denied!')

        return callback(null, { trip })
      })
      .catch(err => callback(err))
  },
  postDestination: (req, callback) => {
    const { name, date, startTime, endTime, cost, address, description, tripId } = req.body
    const { file } = req
    const user = getUser(req)
    if (!name || !date || !startTime || !endTime) throw new Error('Please complete all required fields')

    Promise.all([Trip.findByPk(tripId), localFileHandler(file)])
      .then(([trip, filePath]) => {
        if (!trip) throw new Error("The trip doesn't exist!")
        if (trip.userId !== user.id) throw new Error('Permission denied!')

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
    const user = getUser(req)

    Destination.findByPk(id, {
      include: Trip
    })
      .then(destination => {
        if (!destination) throw new Error("The destination doesn't exist!")
        const deletedData = destination.toJSON()
        if (deletedData.Trip.userId !== user.id) throw new Error('Permission denied!')

        return destination.destroy()
          .then(() => callback(null, { deletedDestination: deletedData }))
          .catch(err => callback(err))
      })
      .catch(err => callback(err))
  },
  editDestination: (req, callback) => {
    const { id } = req.params
    const user = getUser(req)

    Promise.all([
      Destination.findByPk(id, { raw: true }),
      Destination.findByPk(id, { raw: true }).then(destination => destination ? Trip.findByPk(destination.tripId, { raw: true }) : Promise.reject(new Error("The destination doesn't exist!")))
    ])
      .then(([destination, trip]) => {
        if (!trip) throw new Error("The trip doesn't exist!")
        if (trip.userId !== user.id) throw new Error('Permission denied!')
        return callback(null, { destination, trip })
      })
      .catch(err => callback(err))
  },
  putDestination: (req, callback) => {
    const { id } = req.params
    const { name, date, startTime, endTime, cost, address, description, tripId } = req.body
    const { file } = req
    const user = getUser(req)

    if (!name || !date || !startTime || !endTime) throw new Error('Please complete all required fields')

    Promise.all([
      Destination.findByPk(id),
      Trip.findByPk(tripId),
      localFileHandler(file)
    ])
      .then(([destination, trip, filePath]) => {
        if (!destination) throw new Error("The destination doesn't exist!")
        if (!trip) throw new Error("The trip doesn't exist!")
        if (trip.userId !== user.id) throw new Error('Permission denied!')

        // 確認時間在trip區間內
        const tripDayCount = dayInterval(trip.startDate, trip.endDate)
        const dayCount = dayInterval(trip.startDate, timeToUtc(date))
        if (dayCount < 1 || dayCount > tripDayCount) throw new Error('Selected date exceeds the travel period!')

        return destination.update({
          name,
          date,
          startTime,
          endTime,
          cost,
          address,
          description,
          tripId,
          image: filePath || destination.image
        })
      })
      .then(updatedDestination => callback(null, { updatedDestination: updatedDestination.toJSON() }))
      .catch(err => callback(err))
  }
}

module.exports = destinationServices
