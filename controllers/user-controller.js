const userServices = require('../services/user-services')

const userController = {
  getSignUp: (req, res) => {
    res.render('sign-up')
  },
  postSignUp: (req, res, next) => {
    userServices.postSignUp(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_msg', 'Sign-up successful!')
      res.redirect('/signin')
    })
  },
  getSignIn: (req, res) => {
    res.render('sign-in')
  }
}

module.exports = userController
