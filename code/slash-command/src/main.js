'use strict'

const qs = require('querystring')

async function slashCommand(slackEvent, headers, requestContext, notification) {
  const eventData = qs.parse(slackEvent);
  return await notification.send({
    type: 'SLASH_COMMAND',
    payload: eventData,
    metadata: {
      headers,
      requestContext
    }
  })
}

module.exports = slashCommand
