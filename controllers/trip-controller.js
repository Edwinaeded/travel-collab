const tripServices = require('../services/trip-services')

const tripController = {
  getTrips: (req, res, next) => {
    tripServices.getTrips(req, (err, data) => err ? next(err) : res.render('trips', data))
  },
  createTrip: (req, res, next) => {
    try {
      res.render('create-trip')
    } catch (err) {
      next(err)
    }
  },
  postTrip: (req, res, next) => {
    tripServices.postTrip(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_msg', `[ ${data.name} ] has been created successfully!`)
      return res.redirect('/trips')
    })
  },
  editTrip: (req, res, next) => {
    tripServices.editTrip(req, (err, data) => err ? next(err) : res.render('edit-trip', data))
  },
  putTrip: (req, res, next) => {
    tripServices.putTrip(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_msg', 'Trip has been updated successfully!')
      return res.redirect('/trips')
    })
  },
  deleteTrip: (req, res, next) => {
    tripServices.deleteTrip(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_msg', 'Trip has been deleted successfully!')
      return res.redirect('/trips')
    })
  },
  getTrip: (req, res, next) => {
    return res.render('trip')
  }
}

module.exports = tripController
