const dayjs = require('dayjs')
module.exports = {
  dayInterval: (startDate, endDate) => {
    return dayjs(endDate).diff(startDate, 'day') + 1
  }
}
