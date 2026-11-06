const { randomBytes } = require('crypto')
const createOption = require('../util/option.js')

module.exports = (query, request) => {
  const data = {
    algorithmCode: 'ASR',
    algorithmVer: '1.0.0',
    sessionId: query.sessionId || randomBytes(16).toString('hex'),
    recordAudio: query.recordAudio,
    recordAudioFormat: 'AAC',
  }
  return request(
    '/api/music/hum/audio/unifymatch',
    data,
    createOption(query, 'eapi'),
  )
}
