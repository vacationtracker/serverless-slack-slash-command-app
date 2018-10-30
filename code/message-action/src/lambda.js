'use strict'

const {
  httpResponse
} = require('@serverless-slack-command/common')
const main = require('./main')

async function handler(event) {
  if (event.httpMethod === 'OPTIONS')
    return httpResponse()

  console.log(event)
  return httpResponse()
}

exports.handler = handler
