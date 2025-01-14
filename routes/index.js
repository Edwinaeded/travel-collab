const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../middlewares/error-handler')
const tripController = require('../controllers/trip-controller')
const upload = require('../middlewares/multer')

router.get('/trips/create', tripController.createTrip)
router.get('/trips/:id/edit', tripController.editTrip)
router.put('/trips/:id', upload.single('image'), tripController.putTrip)
router.delete('/trips/:id', tripController.deleteTrip)
router.get('/trips', tripController.getTrips)
router.post('/trips', upload.single('image'), tripController.postTrip)

// 設置fallback 並避免無限迴圈
router.use((req, res) => {
  if (req.method === 'GET' && req.path === '/trips') {
    return res.status(404).render('404', { error_msg: '找不到此頁面:(' })
  }
  return res.redirect('/trips')
})
router.use('/', generalErrorHandler)

module.exports = router
