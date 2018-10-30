'use strict'

const qs = require('querystring')

async function messageAction(slackEvent, headers, requestContext, notification) {
  const eventData = qs.parse(slackEvent)
  return await notification.send({
    type: 'MESSAGE_ACTION',
    payload: eventData,
    metadata: {
      headers,
      requestContext
    }
  })
}

module.exports = messageAction
