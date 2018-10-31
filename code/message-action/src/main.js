'use strict'

const qs = require('querystring')

async function messageAction(event, parseSlackButtonResponse, notification) {
  const { slackEvent, headers } = parseSlackButtonResponse(event)
  const eventData = qs.parse(slackEvent);
  return await notification.send({
    type: "MESSAGE_ACTION",
    payload: eventData,
    metadata: {
      headers
    }
  });
}

module.exports = messageAction
