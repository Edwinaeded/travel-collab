const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../middlewares/error-handler')
const tripController = require('../controllers/trip-controller')
const destinationController = require('../controllers/destination-controller')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const chatbotController = require('../controllers/chatbot-controller')
const upload = require('../middlewares/multer')
const passport = require('../middlewares/passport')
const { authenticated, adminAuthenticated } = require('../middlewares/auth')
const { googleMapsLimiter } = require('../middlewares/rate-limiter')

router.get('/signup', userController.getSignUp)
router.post('/signup', userController.postSignUp)
router.get('/signin', userController.getSignIn)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.postSignIn)
router.post('/logout', userController.postLogout)

router.get('/trips/shared', authenticated, tripController.getSharedTrips)
router.get('/trips/create', authenticated, tripController.createTrip)
router.get('/trips/:id/edit', authenticated, tripController.editTrip)
router.get('/trips/:id', googleMapsLimiter, authenticated, tripController.getTrip)
router.put('/trips/:id', authenticated, upload.single('image'), tripController.putTrip)
router.delete('/trips/:id', authenticated, tripController.deleteTrip)
router.get('/trips', authenticated, tripController.getTrips)
router.post('/trips', authenticated, upload.single('image'), tripController.postTrip)

router.get('/destinations/create', authenticated, destinationController.createDestination)
router.get('/destinations/:id/edit', authenticated, destinationController.editDestination)
router.get('/destinations/:id', authenticated, destinationController.getDestination)
router.put('/destinations/:id', googleMapsLimiter, authenticated, upload.single('image'), destinationController.putDestination)
router.delete('/destinations/:id', authenticated, destinationController.deleteDestination)
router.post('/destinations', googleMapsLimiter, authenticated, upload.single('image'), destinationController.postDestination)

router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
router.get('/users/:id', authenticated, userController.getUser)

router.get('/collaborate/edit', authenticated, userController.editCollaborate)
router.get('/collaborate', authenticated, userController.getCollaborate)
router.post('/collaborate', authenticated, userController.postCollaborate)
router.delete('/collaborate', authenticated, userController.deleteCollaborate)

router.delete('/comments/:id', authenticated, destinationController.deleteComment)
router.post('/comments', authenticated, destinationController.postComment)

router.get('/admin/users', adminAuthenticated, adminController.getUsers)
router.put('/admin/:id/isAdmin', adminAuthenticated, adminController.putUser)

router.get('/chatbot', authenticated, chatbotController.getChatbot)
router.post('/chatbot', authenticated, chatbotController.postChatbot)

// 設置fallback 並避免無限迴圈
router.use((req, res) => {
  if (req.method === 'GET' && req.path === '/trips') {
    return res.status(404).render('404', { error_msg: '找不到此頁面:(' })
  }
  return res.redirect('/trips')
})
router.use('/', generalErrorHandler)

module.exports = router
