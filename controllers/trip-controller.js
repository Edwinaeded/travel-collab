const { Trip } = require('../models')

const tripController = {
  getTrips: (req, res) => {
    Trip.findAll({
      raw: true
    })
      .then(trips => {
        res.render('trips', { trips })
      })
      .catch(err => {
        console.log(err)
        res.redirect('/trips')
      })
  }
}

module.exports = tripController
