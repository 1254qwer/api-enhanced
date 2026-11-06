const { randomBytes } = require('crypto')
const createOption = require('../util/option.js')

module.exports = (query, request) => {
  const data = {
    algorithmCode: 'AFP',
    algorithmVer: '1.0.0',
    sessionId: query.sessionId || randomBytes(16).toString('hex'),
    duration: String(query.duration),
    times: String(query.times ?? 1),
    decrypt: '1',
    fingerPrint: query.fingerPrint,
  }
  return request(
    '/api/music/audio/unifymatch',
    data,
    createOption(query, 'eapi'),
  )
}
