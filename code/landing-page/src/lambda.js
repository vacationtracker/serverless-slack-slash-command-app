'use strict'

const {
  httpResponse,
  SnsNotificationRepository
} = require('@serverless-slack-command/common')
const rp = require('minimal-request-promise')
const main = require('./main')

async function handler(event) {
  if (event.httpMethod === 'OPTIONS')
    return httpResponse()

  try {
    const code = event.queryStringParameters.code
    const notification = new SnsNotificationRepository(process.env.notificationTopic)
    const url = await main(rp, process.env, code, notification, event.requestContext)
    return httpResponse('', 302, { Location: url })
  } catch(err) {
    return httpResponse(err, 400)
  }
}

exports.handler = handler
