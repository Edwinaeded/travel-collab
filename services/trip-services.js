const { Trip, Destination, User, Comment } = require('../models')
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

    Trip.findByPk(id, {
      include: [{ model: User, as: 'Receivers' }]
    })
      .then(tripData => {
        if (!tripData) throw new Error("The trip doesn't exist!")
        const trip = tripData.toJSON()
        const isReceiver = trip.Receivers.some(r => r.id === user.id)
        if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

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
      Trip.findByPk(id, { include: [{ model: User, as: 'Receivers' }] })
    ])
      .then(([filePath, tripData]) => {
        if (!tripData) throw new Error("The trip doesn't exist!")
        const trip = tripData.toJSON()
        const isReceiver = trip.Receivers.some(r => r.id === user.id)
        if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')
        return tripData.update({
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

    Trip.findByPk(id, {
      include: [
        { model: User, as: 'Sharers' },
        { model: User, as: 'Receivers' }
      ]
    })
      .then(tripData => {
        if (!tripData) throw new Error("The trip doesn't exist!")
        const trip = tripData.toJSON()
        const isReceiver = trip.Receivers.some(r => r.id === user.id)
        if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

        // tab天數顯示
        const dayCount = dayInterval(trip.startDate, trip.endDate)
        const days = Array.from({ length: dayCount }, (v, i) => i + 1)
        if (!days.includes(currentDay)) throw new Error("The chosen day doesn't exist!")

        // 找出符合指定day的destination資料
        Destination.findAll({
          where: {
            tripId: id,
            date: dayAdd(trip.startDate, currentDay - 1).toJSON()
          },
          include: Comment,
          order: [['startTime'], ['endTime']]
        })
          .then(destinationsData => {
            const data = destinationsData.map((destination, i) => ({
              ...destination.toJSON(),
              description: destination.toJSON().description.substring(0, 180),
              count: i + 1
            }))
            callback(null, { trip, destinations: data, days, currentDay })
          })
          .catch(err => callback(err))
      })
      .catch(err => callback(err))
  },
  getSharedTrips: (req, callback) => {
    const user = getUser(req)
    const limit = 8
    const page = Number(req.query.page) || 1
    const offset = (page - 1) * limit

    User.findByPk(user.id, {
      include: [{ model: Trip, as: 'ReceivedTrips' }]
    })
      .then(user => {
        const pagination = getPagination(user.ReceivedTrips.length, limit, offset)
        const tripsData = user.ReceivedTrips.map(trip => ({
          ...trip.toJSON(),
          description: trip.toJSON().description.substring(0, 50)
        }))
        const tripsDataSlice = tripsData.slice(offset, offset + 8)
        return callback(null, { trips: tripsDataSlice, ...pagination })
      })
      .catch(err => callback(err))
  }
}

module.exports = tripServices
