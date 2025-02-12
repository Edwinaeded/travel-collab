const axios = require('axios')

const getGeoData = async function (address) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    })
    const geoData = response.data
    if (geoData.status !== 'OK' || geoData.results.length === 0) {
      throw new Error('Cannot find a valid address!')
    }

    const location = geoData.results[0].geometry.location
    console.log('轉換經緯度完成：', location)

    return {
      latitude: location.lat,
      longitude: location.lng
    }
  } catch (err) {
    console.error(`Geocoding API 請求失敗: ${err.message}`)
    throw new Error(`Geocoding API 請求失敗: ${err.message}`)
  }
}

module.exports = {
  getGeoData
}
