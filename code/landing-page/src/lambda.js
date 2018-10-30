'use strict'

const {
  httpResponse
} = require('@serverless-slack-command/common')
const rp = require('minimal-request-promise')
const main = require('./main')

async function handler(event) {
  if (event.httpMethod === 'OPTIONS')
    return httpResponse()

  try {
    const code = event.queryStringParameters.code
    const url = await main(rp, process.env, code)
    return httpResponse('', 302, {
      Location: url
    })
  } catch(err) {
    return httpResponse(err, 400)
  }
}

exports.handler = handler
