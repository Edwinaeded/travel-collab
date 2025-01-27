const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

module.exports = {
  dayInterval: (startDate, endDate) => {
    return dayjs(endDate).utc().diff(dayjs(startDate).utc(), 'day') + 1
  },
  timeToUtc: date => {
    if (!date.includes('T')) return `${date}T00:00:00.000Z`
    return date
  }
}
