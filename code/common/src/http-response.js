'use strict'

function httpResponse(body, statusCode, headers) {
  const code = statusCode || (body ? 200 : 204)
  const responseHeaders = headers || {
    'Access-Control-Allow-Headers':
      'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': '86400'
  }

  if (typeof body === 'object') body = body.toString()

  return {
    statusCode: code,
    body: body || '',
    headers: responseHeaders
  }
}

module.exports = httpResponse
