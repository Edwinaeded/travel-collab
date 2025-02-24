const rateLimit = require('express-rate-limit')

const googleMapsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 20,
  message: 'Too many requests, please try again later!',
  standardHeaders: true,
  legacyHeaders: false
})

const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  message: 'Too many requests, please try again later!',
  standardHeaders: true,
  legacyHeaders: false
})

module.exports = { googleMapsLimiter, globalLimiter }
