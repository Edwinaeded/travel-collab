const destinationServices = require('../services/destination-services')

const destinationController = {
  getDestination: (req, res) => {
    return res.render('destination')
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
