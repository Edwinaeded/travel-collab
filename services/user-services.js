const { Op } = require('sequelize')
const { User, Trip, Share } = require('../models')
const bcrypt = require('bcryptjs')
const { getUser } = require('../helpers/auth-helper')
const { localFileHandler } = require('../helpers/file-helpers')

const userServices = {
  postSignUp: async (req, callback) => {
    try {
      const { name, email, password, confirmPassword, shareId } = req.body
      if (!name || !email || !password || !confirmPassword || !shareId) throw new Error('Please complete all required fields')
      if (password !== confirmPassword) throw new Error('Passwords do not match!')
      const defaultImg = ['user-root', 'user1', 'user2', 'user3']

      const [emailUser, idUser] = await Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { shareId } })
      ])
      if (emailUser) throw new Error('Email already exists!')
      if (idUser) throw new Error('Share Id already exists!')

      const hash = await bcrypt.hash(password, 10)

      const newUser = await User.create({
        name,
        email,
        password: hash,
        shareId,
        image: `/images/seed-photo/${defaultImg[Math.floor(Math.random() * 4)]}.svg`
      })

      return callback(null, { newUser })
    } catch (err) {
      return callback(err)
    }
  },
  getUser: async (req, callback) => {
    try {
      const currentUser = getUser(req)
      const id = Number(req.params.id)
      if (id !== currentUser.id) throw new Error('Permission denied!')

      const user = await User.findByPk(id, { raw: true })
      if (!user) throw new Error("User doesn't exist!")

      return callback(null, { user })
    } catch (err) {
      return callback(err)
    }
  },
  editUser: async (req, callback) => {
    try {
      const currentUser = getUser(req)
      const id = Number(req.params.id)
      if (id !== currentUser.id) throw new Error('Permission denied!')

      const user = await User.findByPk(id, { raw: true })
      if (!user) throw new Error("User doesn't exist!")

      return callback(null, { user })
    } catch (err) {
      return callback(err)
    }
  },
  putUser: async (req, callback) => {
    try {
      const { name, shareId } = req.body
      const { file } = req
      const currentUser = getUser(req)
      const id = Number(req.params.id)
      if (id !== currentUser.id) throw new Error('Permission denied!')

      const [user, idUser, filePath] = await Promise.all([
        User.findByPk(id),
        User.findOne({ where: { shareId, id: { [Op.ne]: id } } }),
        localFileHandler(file)
      ])
      if (!user) throw new Error("User doesn't exist!")
      if (idUser) throw new Error('Share Id already exists!')

      const updatedUser = await user.update({
        name,
        image: filePath || user.image,
        shareId
      })

      return callback(null, { user: updatedUser.toJSON() })
    } catch (err) {
      return callback(err)
    }
  },
  getCollaborate: async (req, callback) => {
    try {
      const shareId = req.query.shareId || null
      const tripId = Number(req.query.trip)
      const currentUser = getUser(req)
      if (!tripId) throw new Error('Invalid trip!')

      if (!shareId) {
        const trip = await Trip.findByPk(tripId, {
          include: [{ model: User, as: 'Receivers' }]
        })
        if (!trip) throw new Error("Trip doesn't exist!")
        if (trip.userId !== currentUser.id) throw new Error('Permission denied!')

        return callback(null, { trip: trip.toJSON() })
      } else {
        const [trip, searchUser] = await Promise.all([
          Trip.findByPk(tripId, {
            include: [{ model: User, as: 'Receivers' }]
          }),
          User.findOne({ where: { shareId }, raw: true })
        ])
        if (!trip) throw new Error("Trip doesn't exist!")
        if (trip.userId !== currentUser.id) throw new Error('Permission denied!')
        if (!searchUser) throw new Error("User doesn't exist!")

        return callback(null, { trip: trip.toJSON(), searchUser })
      }
    } catch (err) {
      return callback(err)
    }
  },
  postCollaborate: async (req, callback) => {
    try {
      const tripId = Number(req.body.tripId)
      const sharedUserId = Number(req.body.sharedUserId)
      const currentUser = getUser(req)

      const [trip, sharedUser] = await Promise.all([
        Trip.findByPk(tripId, { include: { model: User, as: 'Receivers' } }),
        User.findByPk(sharedUserId)
      ])
      if (!trip) throw new Error("Trip doesn't exist!")
      if (!sharedUser) throw new Error("User doesn't exist!")
      if (trip.userId !== currentUser.id) throw new Error('Permission denied!')

      const isAdded = Array.isArray(trip.Receivers) && trip.Receivers.some(receiver => receiver.id === sharedUser.id)
      if (isAdded) throw new Error('User already added!')
      if (sharedUserId === currentUser.id) throw new Error('You are the trip owner!')

      const newShare = await Share.create({
        userId: currentUser.id,
        tripId,
        sharedUserId
      })

      return callback(null, { newShare: newShare.toJSON(), tripId })
    } catch (err) {
      return callback(err)
    }
  },
  editCollaborate: async (req, callback) => {
    try {
      const currentUser = getUser(req)
      const tripId = Number(req.query.trip)

      const trip = await Trip.findByPk(tripId, { include: { model: User, as: 'Receivers' } })
      if (!trip) throw new Error("Trip doesn't exist!")
      if (trip.userId !== currentUser.id) throw new Error('Permission denied!')

      return callback(null, { trip: trip.toJSON() })
    } catch (err) {
      return callback(err)
    }
  },
  deleteCollaborate: async (req, callback) => {
    try {
      const sharedUserId = Number(req.body.sharedUserId)
      const tripId = Number(req.body.tripId)
      const currentUser = getUser(req)

      const [share, trip] = await Promise.all([
        Share.findOne({ where: { tripId, sharedUserId } }),
        Trip.findByPk(tripId, { raw: true })
      ])
      if (!share) throw new Error('Co-editing record not found!')
      if (!trip) throw new Error("Trip doesn't exist!")
      if (trip.userId !== currentUser.id) throw new Error('Permission denied!')

      const deletedShare = await Share.destroy({ where: { tripId, sharedUserId } })

      return callback(null, { deletedCount: deletedShare, tripId })
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = userServices
