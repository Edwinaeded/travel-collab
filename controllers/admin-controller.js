const adminServices = require('../services/admin-services')

const adminController = {
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => {
      if (err) return next(err)
      res.render('admin-users', data)
    })
  }
}

module.exports = adminController
