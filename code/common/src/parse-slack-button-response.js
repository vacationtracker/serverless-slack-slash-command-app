'use strict'

const qs = require('querystring')

function parseSlackButtonResponse(event) {
  const slackEvent = qs.parse(event.body)

  return {
    slackEvent,
    headers: event.headers
  }
}

module.exports = parseSlackButtonResponse
