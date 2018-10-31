'use strict'

const {
  httpResponse,
  parseSlackButtonResponse,
  SnsNotificationRepository
} = require("@serverless-slack-command/common");
const main = require('./main')

async function handler(event) {
  if (event.httpMethod === 'OPTIONS')
    return httpResponse()

  const notification = new SnsNotificationRepository(process.env.notificationTopic)

  await main(event, parseSlackButtonResponse, notification);
  return httpResponse()
}

exports.handler = handler
