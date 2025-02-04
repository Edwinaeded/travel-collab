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
  },
  postSignIn: (req, res, next) => {
    req.flash('success_msg', 'Sign-in successful!')
    res.redirect('/trips')
  },
  postLogout: (req, res, next) => {
    req.logout(err => {
      if (err) return next(err)
      req.flash('success_msg', 'Logout successful!')
      res.redirect('/signin')
    })
  }
}

module.exports = userController
