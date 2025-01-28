const destinationServices = require('../services/destination-services')

const destinationController = {
  getDestination: (req, res, next) => {
    destinationServices.getDestination(req, (err, data) => err ? next(err) : res.render('destination', data))
  },
  createDestination: (req, res, next) => {
    destinationServices.createDestination(req, (err, data) => err ? next(err) : res.render('create-destination', data))
  },
  postDestination: (req, res, next) => {
    destinationServices.postDestination(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_msg', `[ ${data.newDestination.name} ] has been created successfully!`)
      return res.redirect(`/trips/${data.tripId}`)
    })
  }
}

module.exports = destinationController
