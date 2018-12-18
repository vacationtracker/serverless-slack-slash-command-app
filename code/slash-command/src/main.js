'use strict'

const qs = require('querystring')

async function slashCommand(slackEvent, notification, headers = {}, requestContext = {}) {
  if (!slackEvent || typeof slackEvent !== 'string')
    throw new Error('Slack Event is required and it should be an object.')

  if (!notification || typeof notification.send !== 'function')
    throw new Error('An instance of notification repository is required.')

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
