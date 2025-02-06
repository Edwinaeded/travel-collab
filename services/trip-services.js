const { Trip, Destination } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const { getPagination } = require('../helpers/pagination-helpers')
const { dayInterval, dayAdd } = require('../helpers/dayjs-helper')
const { getUser } = require('../helpers/auth-helper')

const tripServices = {
  getTrips: (req, callback) => {
    const user = getUser(req)
    const limit = 8
    const page = Number(req.query.page) || 1
    const offset = (page - 1) * limit

    Trip.findAndCountAll({
      where: { userId: user.id },
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
    const user = getUser(req)
    if (!name || !startDate || !endDate) throw new Error('Please complete all required fields')

    localFileHandler(file)
      .then(filePath => {
        return Trip.create({
          name,
          startDate,
          endDate,
          description,
          image: filePath || null,
          userId: user.id
        })
      })
      .then(newTrip => callback(null, { newTrip, name }))
      .catch(err => callback(err))
  },
  editTrip: (req, callback) => {
    const { id } = req.params
    const user = getUser(req)

    Trip.findOne({ where: { id }, raw: true })
      .then(trip => {
        if (!trip) throw new Error("The trip doesn't exist!")
        if (trip.userId !== user.id) throw new Error('Permission denied!')

        callback(null, { trip })
      })
      .catch(err => callback(err))
  },
  putTrip: (req, callback) => {
    const { id } = req.params
    const { name, startDate, endDate, description } = req.body
    const { file } = req
    const user = getUser(req)

    if (!name || !startDate || !endDate) throw new Error('Please complete all required fields')

    Promise.all([
      localFileHandler(file),
      Trip.findByPk(id)
    ])
      .then(([filePath, trip]) => {
        if (!trip) throw new Error("The trip doesn't exist!")
        if (trip.userId !== user.id) throw new Error('Permission denied!')
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
    const user = getUser(req)

    Trip.findByPk(id)
      .then(trip => {
        if (!trip) throw new Error("The trip doesn't exist!")
        if (trip.userId !== user.id) throw new Error('Permission denied!')
        return trip.destroy()
      })
      .then(deletedTrip => callback(null, { deletedTrip }))
      .catch(err => callback(err))
  },
  getTrip: (req, callback) => {
    const { id } = req.params
    const currentDay = Number(req.query.day) || 1
    const user = getUser(req)

    Trip.findByPk(id, { raw: true })
      .then(trip => {
        if (!trip) throw new Error("The trip doesn't exist!")
        if (trip.userId !== user.id) throw new Error('Permission denied!')
        // tab天數顯示
        const dayCount = dayInterval(trip.startDate, trip.endDate)
        const days = Array.from({ length: dayCount }, (v, i) => i + 1)
        if (!days.includes(currentDay)) throw new Error("The chosen day doesn't exist!")
        // 找出符合指定day的destination資料
        Destination.findAll({
          raw: true,
          where: {
            tripId: id,
            date: dayAdd(trip.startDate, currentDay - 1).toJSON()
          },
          order: [['startTime'], ['endTime']]
        })
          .then(destinations => {
            const data = destinations.map(destination => ({
              ...destination,
              description: destination.description.substring(0, 180)
            }))
            callback(null, { trip, destinations: data, days, currentDay })
          })
      })
      .catch(err => callback(err))
  }
}

module.exports = tripServices
