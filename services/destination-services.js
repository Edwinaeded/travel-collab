const { Trip, Destination, User, Comment } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const { dayInterval, timeToUtc } = require('../helpers/dayjs-helper')
const { getUser } = require('../helpers/auth-helper')

const destinationServices = {
  getDestination: (req, callback) => {
    const { id } = req.params
    const user = getUser(req)

    Destination.findByPk(id, {
      include: [
        { model: Trip, include: [{ model: User, as: 'Receivers' }] },
        { model: Comment, include: User }
      ]
    })
      .then(destinationData => {
        if (!destinationData) throw new Error("The destination doesn't exist!")
        const destination = destinationData.toJSON()
        const isReceiver = destination.Trip.Receivers.some(r => r.id === user.id)
        if (destination.Trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')
        return callback(null, { destination })
      })
      .catch(err => callback(err))
  },
  createDestination: (req, callback) => {
    const id = req.query.trip
    const user = getUser(req)

    Trip.findByPk(id, { include: [{ model: User, as: 'Receivers' }] })
      .then(tripData => {
        if (!tripData) throw new Error("The trip doesn't exist!")
        const trip = tripData.toJSON()
        const isReceiver = trip.Receivers.some(r => r.id === user.id)
        if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

        return callback(null, { trip })
      })
      .catch(err => callback(err))
  },
  postDestination: (req, callback) => {
    const { name, date, startTime, endTime, cost, address, description, tripId } = req.body
    const { file } = req
    const user = getUser(req)
    if (!name || !date || !startTime || !endTime) throw new Error('Please complete all required fields')

    Promise.all([
      Trip.findByPk(tripId, { include: [{ model: User, as: 'Receivers' }] }),
      localFileHandler(file)
    ])
      .then(([tripData, filePath]) => {
        if (!tripData) throw new Error("The trip doesn't exist!")
        const trip = tripData.toJSON()
        const isReceiver = trip.Receivers.some(r => r.id === user.id)
        if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

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
      include: [{ model: Trip, include: [{ model: User, as: 'Receivers' }] }]
    })
      .then(destinationData => {
        if (!destinationData) throw new Error("The destination doesn't exist!")
        const destination = destinationData.toJSON()
        const isReceiver = destination.Trip.Receivers.some(r => r.id === user.id)
        if (destination.Trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

        return destinationData.destroy()
          .then(() => callback(null, { deletedDestination: destination }))
          .catch(err => callback(err))
      })
      .catch(err => callback(err))
  },
  editDestination: (req, callback) => {
    const { id } = req.params
    const user = getUser(req)

    Promise.all([
      Destination.findByPk(id, { raw: true }),
      Destination.findByPk(id, { raw: true })
        .then(destination => destination ? Trip.findByPk(destination.tripId, { include: { model: User, as: 'Receivers' } }) : Promise.reject(new Error("The destination doesn't exist!")))
    ])
      .then(([destination, tripData]) => {
        if (!tripData) throw new Error("The trip doesn't exist!")
        const trip = tripData.toJSON()
        const isReceiver = trip.Receivers.some(r => r.id === user.id)
        if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')
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
      Trip.findByPk(tripId, { include: { model: User, as: 'Receivers' } }),
      localFileHandler(file)
    ])
      .then(([destination, tripData, filePath]) => {
        if (!destination) throw new Error("The destination doesn't exist!")
        if (!tripData) throw new Error("The trip doesn't exist!")
        const trip = tripData.toJSON()
        const isReceiver = trip.Receivers.some(r => r.id === user.id)
        if (trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

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
  },
  postComment: (req, callback) => {
    const { text } = req.body
    const destinationId = Number(req.body.destinationId)
    const user = getUser(req)

    Destination.findByPk(destinationId, {
      include: [{ model: Trip, include: { model: User, as: 'Receivers' } }]
    })
      .then(destinationData => {
        if (!destinationData) throw new Error("The destination doesn't exist!")
        const destination = destinationData.toJSON()
        const isReceiver = destination.Trip.Receivers.some(r => r.id === user.id)
        if (destination.Trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

        return Comment.create({
          userId: user.id,
          destinationId,
          text
        })
      })
      .then(newComment => callback(null, { newComment: newComment.toJSON(), destinationId }))
      .catch(err => callback(err))
  },
  deleteComment: (req, callback) => {
    const commentId = Number(req.params.id)
    const destinationId = Number(req.body.destinationId)
    const user = getUser(req)

    Promise.all([
      Comment.findByPk(commentId),
      Destination.findByPk(destinationId, {
        include: [{ model: Trip, include: [{ model: User, as: 'Receivers' }] }]
      })
    ])
      .then(([comment, destinationData]) => {
        if (!comment) throw new Error("The comment doesn't exist!")
        const destination = destinationData.toJSON()
        const isReceiver = destination.Trip.Receivers.some(r => r.id === user.id)
        if (destination.Trip.userId !== user.id && !isReceiver) throw new Error('Permission denied!')

        return comment.destroy()
      })
      .then(deletedComment => callback(null, { deletedComment: deletedComment.toJSON(), destinationId }))
      .catch(err => callback(err))
  }
}

module.exports = destinationServices
