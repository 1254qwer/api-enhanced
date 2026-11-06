const { randomBytes } = require('crypto')
const createOption = require('../util/option.js')

module.exports = (query, request) => {
  const data = {
    algorithmCode: 'HFP',
    algorithmVer: '1.0.0',
    sessionId: query.sessionId || randomBytes(16).toString('hex'),
    fingerPrint: query.fingerPrint,
  }
  return request(
    '/api/music/hum/fingerprint/unifymatch',
    data,
    createOption(query, 'eapi'),
  )
}
