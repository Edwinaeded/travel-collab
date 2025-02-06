const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../middlewares/error-handler')
const tripController = require('../controllers/trip-controller')
const destinationController = require('../controllers/destination-controller')
const userController = require('../controllers/user-controller')
const upload = require('../middlewares/multer')
const passport = require('../middlewares/passport')
const { authenticated } = require('../middlewares/auth')

router.get('/signup', userController.getSignUp)
router.post('/signup', userController.postSignUp)
router.get('/signin', userController.getSignIn)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.postSignIn)
router.post('/logout', userController.postLogout)

router.get('/trips/create', authenticated, tripController.createTrip)
router.get('/trips/:id/edit', authenticated, tripController.editTrip)
router.get('/trips/:id', authenticated, tripController.getTrip)
router.put('/trips/:id', authenticated, upload.single('image'), tripController.putTrip)
router.delete('/trips/:id', authenticated, tripController.deleteTrip)
router.get('/trips', authenticated, tripController.getTrips)
router.post('/trips', authenticated, upload.single('image'), tripController.postTrip)

router.get('/destinations/create', authenticated, destinationController.createDestination)
router.get('/destinations/:id/edit', authenticated, destinationController.editDestination)
router.get('/destinations/:id', authenticated, destinationController.getDestination)
router.put('/destinations/:id', authenticated, upload.single('image'), destinationController.putDestination)
router.delete('/destinations/:id', authenticated, destinationController.deleteDestination)
router.post('/destinations', authenticated, upload.single('image'), destinationController.postDestination)

router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
router.get('/users/:id', authenticated, userController.getUser)

router.get('/collaborate', authenticated, userController.getCollaborate)

// 設置fallback 並避免無限迴圈
router.use((req, res) => {
  if (req.method === 'GET' && req.path === '/trips') {
    return res.status(404).render('404', { error_msg: '找不到此頁面:(' })
  }
  return res.redirect('/trips')
})
router.use('/', generalErrorHandler)

module.exports = router
