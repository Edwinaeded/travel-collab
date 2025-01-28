const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),
  formatDate: rawDate => dayjs(rawDate).format('YYYY/MM/DD'),
  formatDateForInput: rawDate => dayjs(rawDate).format('YYYY-MM-DD'),
  formatTime: rawTime => {
    if (!rawTime) return ''
    const fullTime = dayjs(`2000-01-01T${rawTime}`)
    return fullTime.format('HH:mm')
  },
  relativeTimeFromNow: rawTime => dayjs(rawTime).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
