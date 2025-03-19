const { Trip, Destination, User, Comment } = require('../models')
const { dayInterval, timeToUtc } = require('../helpers/dayjs-helper')
const { getUser } = require('../helpers/auth-helper')
const { getGeoData } = require('../helpers/googleMaps-helper')
const { localFileHandler, S3FileHandler } = require('../helpers/file-helpers')
const FileHandler = process.env.NODE_ENV === 'production' ? S3FileHandler : localFileHandler

const destinationServices = {
  getDestination: async (req, callback) => {
    try {
      const { id } = req.params
      const user = getUser(req)

      const destinationData = await Destination.findByPk(id, {
        include: [
          { model: Trip, include: [{ model: User, as: 'Receivers' }] },
          { model: Comment, include: User }
        ]
      })

      if (!destinationData) throw new Error("The destination doesn't exist!")
      const destination = destinationData.toJSON()

      const isReceiver = destination.Trip.Receivers.some(r => r.id === user.id)
      if (destination.Trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

      return callback(null, { destination })
    } catch (err) {
      return callback(err)
    }
  },
  createDestination: async (req, callback) => {
    try {
      const id = req.query.trip
      const user = getUser(req)

      const tripData = await Trip.findByPk(id, { include: [{ model: User, as: 'Receivers' }] })

      if (!tripData) throw new Error("The trip doesn't exist!")
      const trip = tripData.toJSON()

      const isReceiver = trip.Receivers.some(r => r.id === user.id)
      if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

      return callback(null, { trip })
    } catch (err) {
      return callback(err)
    }
  },
  postDestination: async (req, callback) => {
    try {
      const { name, date, startTime, endTime, cost, address, description, tripId } = req.body
      const { file } = req
      const user = getUser(req)
      if (!name || !date || !startTime || !endTime || !address) throw new Error('Please complete all required fields')

      const [tripData, filePath = null, geoData = {}] = await Promise.all([
        Trip.findByPk(tripId, { include: [{ model: User, as: 'Receivers' }] }),
        FileHandler(file),
        getGeoData(address)
      ])

      if (!tripData) throw new Error("The trip doesn't exist!")
      const trip = tripData.toJSON()

      const isReceiver = trip.Receivers.some(r => r.id === user.id)
      if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

      // 確認時間在trip區間內
      const tripDayCount = dayInterval(trip.startDate, trip.endDate)
      const dayCount = dayInterval(trip.startDate, timeToUtc(date))
      if (dayCount < 1 || dayCount > tripDayCount) throw new Error('Selected date exceeds the travel period!')

      const newDestination = await Destination.create({
        name,
        date,
        startTime,
        endTime,
        cost,
        address,
        description,
        tripId,
        image: filePath || null,
        latitude: geoData.latitude,
        longitude: geoData.longitude
      })

      return callback(null, { newDestination, tripId })
    } catch (err) {
      return callback(err)
    }
  },
  deleteDestination: async (req, callback) => {
    try {
      const { id } = req.params
      const user = getUser(req)

      const destinationData = await Destination.findByPk(id, {
        include: [{ model: Trip, include: [{ model: User, as: 'Receivers' }] }]
      })

      if (!destinationData) throw new Error("The destination doesn't exist!")
      const destination = destinationData.toJSON()

      const isReceiver = destination.Trip.Receivers.some(r => r.id === user.id)
      if (destination.Trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

      await destinationData.destroy()

      return callback(null, { deletedDestination: destination })
    } catch (err) {
      return callback(err)
    }
  },
  editDestination: async (req, callback) => {
    try {
      const { id } = req.params
      const user = getUser(req)

      const destination = await Destination.findByPk(id, { raw: true })
      if (!destination) throw new Error("The destination doesn't exist!")

      const tripData = await Trip.findByPk(destination.tripId, { include: { model: User, as: 'Receivers' } })
      if (!tripData) throw new Error("The trip doesn't exist!")
      const trip = tripData.toJSON()

      const isReceiver = trip.Receivers.some(r => r.id === user.id)
      if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

      return callback(null, { destination, trip })
    } catch (err) {
      return callback(err)
    }
  },
  putDestination: async (req, callback) => {
    try {
      const { id } = req.params
      const { name, date, startTime, endTime, cost, address, description, tripId } = req.body
      const { file } = req
      const user = getUser(req)

      if (!name || !date || !startTime || !endTime || !address) throw new Error('Please complete all required fields')

      const [destination, tripData, filePath] = await Promise.all([
        Destination.findByPk(id),
        Trip.findByPk(tripId, { include: { model: User, as: 'Receivers' } }),
        FileHandler(file)
      ])

      if (!destination) throw new Error("The destination doesn't exist!")
      if (!tripData) throw new Error("The trip doesn't exist!")
      const trip = tripData.toJSON()
      const isReceiver = trip.Receivers.some(r => r.id === user.id)
      if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

      // 確認時間在trip區間內
      const tripDayCount = dayInterval(trip.startDate, trip.endDate)
      const dayCount = dayInterval(trip.startDate, timeToUtc(date))
      if (dayCount < 1 || dayCount > tripDayCount) throw new Error('Selected date exceeds the travel period!')

      //  確認地址是否更改
      let latitude = destination.latitude
      let longitude = destination.longitude

      if (destination.address !== address) {
        console.log('地址已變更，重新取得經緯度...')

        const geoData = getGeoData(address)
        latitude = geoData.latitude
        longitude = geoData.longitude
      }

      const updatedDestination = await destination.update({
        name,
        date,
        startTime,
        endTime,
        cost,
        address,
        description,
        tripId,
        image: filePath || destination.image,
        latitude,
        longitude
      })

      return callback(null, { updatedDestination: updatedDestination.toJSON() })
    } catch (err) {
      return callback(err)
    }
  },
  postComment: async (req, callback) => {
    try {
      const { text } = req.body
      const destinationId = Number(req.body.destinationId)
      const user = getUser(req)

      const destinationData = await Destination.findByPk(destinationId, {
        include: [{ model: Trip, include: { model: User, as: 'Receivers' } }]
      })

      if (!destinationData) throw new Error("The destination doesn't exist!")
      const destination = destinationData.toJSON()

      const isReceiver = destination.Trip.Receivers.some(r => r.id === user.id)
      if (destination.Trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

      const newComment = await Comment.create({
        userId: user.id,
        destinationId,
        text
      })

      return callback(null, { newComment: newComment.toJSON(), destinationId })
    } catch (err) {
      return callback(err)
    }
  },
  deleteComment: async (req, callback) => {
    try {
      const commentId = Number(req.params.id)
      const destinationId = Number(req.body.destinationId)
      const user = getUser(req)

      const [comment, destinationData] = await Promise.all([
        Comment.findByPk(commentId),
        Destination.findByPk(destinationId, {
          include: [{ model: Trip, include: [{ model: User, as: 'Receivers' }] }]
        })
      ])

      if (!comment) throw new Error("The comment doesn't exist!")
      const destination = destinationData.toJSON()
      const isReceiver = destination.Trip.Receivers.some(r => r.id === user.id)
      if (destination.Trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

      const deletedComment = await comment.destroy()

      return callback(null, { deletedComment: deletedComment.toJSON(), destinationId })
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = destinationServices
