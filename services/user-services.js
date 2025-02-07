const { Op } = require('sequelize')
const { User, Trip, Share } = require('../models')
const bcrypt = require('bcryptjs')
const { getUser } = require('../helpers/auth-helper')
const { localFileHandler } = require('../helpers/file-helpers')

const userServices = {
  postSignUp: (req, callback) => {
    const { name, email, password, confirmPassword, shareId } = req.body
    if (!name || !email || !password || !confirmPassword || !shareId) throw new Error('Please complete all required fields')
    if (password !== confirmPassword) throw new Error('Passwords do not match!')

    Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { shareId } })
    ])
      .then(([emailUser, idUser]) => {
        if (emailUser) throw new Error('Email already exists!')
        if (idUser) throw new Error('Share Id already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        User.create({
          name,
          email,
          password: hash,
          shareId
        })
      })
      .then(newUser => callback(null, { newUser }))
      .catch(err => callback(err))
  },
  getUser: (req, callback) => {
    const currentUser = getUser(req)
    const id = Number(req.params.id)
    if (id !== currentUser.id) throw new Error('Permission denied!')

    User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        return callback(null, { user })
      })
      .catch(err => callback(err))
  },
  editUser: (req, callback) => {
    const currentUser = getUser(req)
    const id = Number(req.params.id)
    if (id !== currentUser.id) throw new Error('Permission denied!')

    User.findByPk(id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User doesn't exist!")
        return callback(null, { user })
      })
      .catch(err => callback(err))
  },
  putUser: (req, callback) => {
    const { name, shareId } = req.body
    const { file } = req
    const currentUser = getUser(req)
    const id = Number(req.params.id)
    if (id !== currentUser.id) throw new Error('Permission denied!')

    Promise.all([
      User.findByPk(id),
      User.findOne({ where: { shareId, id: { [Op.ne]: id } } }),
      localFileHandler(file)
    ])
      .then(([user, idUser, filePath]) => {
        if (!user) throw new Error("User doesn't exist!")
        if (idUser) throw new Error('Share Id already exists!')
        return user.update({
          name,
          image: filePath || user.image,
          shareId
        })
      })
      .then(updatedUser => callback(null, { user: updatedUser.toJSON() }))
      .catch(err => callback(err))
  },
  getCollaborate: (req, callback) => {
    const shareId = req.query.shareId || null
    const tripId = Number(req.query.trip)
    const currentUser = getUser(req)

    if (!tripId) throw new Error('Invalid trip!')
    if (!shareId) {
      Trip.findByPk(tripId, {
        include: [{ model: User, as: 'Receivers' }]
      })
        .then(trip => {
          if (!trip) throw new Error("Trip doesn't exist!")
          if (trip.userId !== currentUser.id) throw new Error('Permission denied!')
          return callback(null, { trip: trip.toJSON() })
        })
        .catch(err => callback(err))
    } else {
      Promise.all([
        Trip.findByPk(tripId, {
          include: [{ model: User, as: 'Receivers' }]
        }),
        User.findOne({ where: { shareId }, raw: true })
      ])
        .then(([trip, user]) => {
          if (!trip) throw new Error("Trip doesn't exist!")
          if (!user) throw new Error("User doesn't exist!")
          return callback(null, { trip: trip.toJSON(), searchUser: user })
        })
        .catch(err => callback(err))
    }
  },
  postCollaborate: (req, callback) => {
    const tripId = Number(req.body.tripId)
    const sharedUserId = Number(req.body.sharedUserId)
    const currentUser = getUser(req)

    Promise.all([
      Trip.findByPk(tripId, { include: { model: User, as: 'Receivers' } }),
      User.findByPk(sharedUserId)
    ])
      .then(([trip, sharedUser]) => {
        if (!trip) throw new Error("Trip doesn't exist!")
        if (!sharedUser) throw new Error("User doesn't exist!")
        if (trip.userId !== currentUser.id) throw new Error('Permission denied!')
        const isAdded = Array.isArray(trip.Receivers) && trip.Receivers.some(receiver => receiver.id === sharedUser.id)
        if (isAdded) throw new Error('User already added!')
        if (sharedUserId === currentUser.id) throw new Error('You are the trip owner!')

        return Share.create({
          userId: currentUser.id,
          tripId,
          sharedUserId
        })
      })
      .then(newShare => callback(null, { newShare: newShare.toJSON(), tripId }))
      .catch(err => callback(err))
  },
  editCollaborate: (req, callback) => {
    const currentUser = getUser(req)
    const tripId = Number(req.query.trip)

    Promise.all([
      Trip.findByPk(tripId, { include: { model: User, as: 'Receivers' } }),
      User.findByPk(currentUser.id)
    ])
      .then(([trip, user]) => {
        if (!trip) throw new Error("Trip doesn't exist!")
        if (trip.userId !== currentUser.id) throw new Error('Permission denied!')
        return callback(null, { trip: trip.toJSON() })
      })
      .catch(err => callback(err))
  }
}

module.exports = userServices
