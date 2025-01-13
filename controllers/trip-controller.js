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
      console.log(data)
      req.flash('success_msg', `Trip[${data.name}] has been created successfully!`)
      return res.redirect('/trips')
    })
  }
}

module.exports = tripController
