const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),
  formatDate: rawDate => dayjs(rawDate).format('YYYY/MM/DD'),
  formatDateForInput: rawDate => dayjs(rawDate).format('YYYY-MM-DD'),
  relativeTimeFromNow: rawTime => dayjs(rawTime).fromNow()
}
