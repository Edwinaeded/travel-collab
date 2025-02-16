const adminServices = require('../services/admin-services')

const adminController = {
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => {
      if (err) return next(err)
      res.render('admin-users', data)
    })
  },
  putUser: (req, res, next) => {
    adminServices.putUser(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_msg', `Permission of [ ${data.updatedUser.name} ] updated successfully!`)
      res.redirect('/admin/users')
    })
  }
}

module.exports = adminController
