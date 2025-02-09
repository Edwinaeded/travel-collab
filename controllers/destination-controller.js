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
  },
  deleteDestination: (req, res, next) => {
    destinationServices.deleteDestination(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_msg', `[ ${data.deletedDestination.name} ] has been deleted successfully!`)
      return res.redirect(`/trips/${data.deletedDestination.tripId}`)
    })
  },
  editDestination: (req, res, next) => {
    destinationServices.editDestination(req, (err, data) => err ? next(err) : res.render('edit-destination', data))
  },
  putDestination: (req, res, next) => {
    destinationServices.putDestination(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_msg', `[ ${data.updatedDestination.name} ] has been updated successfully!`)
      return res.redirect(`/destinations/${data.updatedDestination.id}`)
    })
  },
  postComment: (req, res, next) => {
    destinationServices.postComment(req, (err, data) => {
      if (err) return next(err)
      res.redirect(`/destinations/${data.destinationId}`)
    })
  },
  deleteComment: (req, res, next) => {
    destinationServices.deleteComment(req, (err, data) => {
      if (err) return next(err)
      res.redirect(`/destinations/${data.destinationId}`)
    })
  }
}

module.exports = destinationController
