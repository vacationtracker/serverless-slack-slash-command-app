'use strict'

const {
  httpResponse,
  SnsNotificationRepository
} = require('@serverless-slack-command/common')
const main = require('./main')

async function handler(event) {
  const notification = new SnsNotificationRepository(process.env.notificationTopic)
  await main(event.body, event.headers, event.requestContext, notification)
  return httpResponse()
}

exports.handler = handler
