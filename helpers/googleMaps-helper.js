const axios = require('axios')

const getGeoData = async function (address) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY_BACKEND
      }
    })
    const geoData = response.data
    if (geoData.status !== 'OK' || geoData.results.length === 0) {
      throw new Error('Cannot find a valid address!')
    }

    const location = geoData.results[0].geometry.location

    return {
      latitude: location.lat,
      longitude: location.lng
    }
  } catch (err) {
    console.error(`Geocoding API 請求失敗: ${err.message}`)
    throw new Error(`Geocoding API 請求失敗: ${err.message}`)
  }
}

const getGoogleMapsRoute = async function (req) {
  try {
    const params = {
      origin: req.origin,
      destination: req.destination,
      key: process.env.GOOGLE_MAPS_API_KEY_BACKEND
    }
    if (req.waypoints && req.waypoints.length > 0) {
      params.waypoints = req.waypoints.join('|')
    }
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', { params })
    if (response.data.status !== 'OK') throw new Error(`路徑計算失敗: ${response.data.status}`)

    return response.data
  } catch (err) {
    console.error(`Directions API 請求失敗: ${err.message}`)
    throw new Error(`Directions API 請求失敗: ${err.message}`)
  }
}

module.exports = {
  getGeoData,
  getGoogleMapsRoute
}
