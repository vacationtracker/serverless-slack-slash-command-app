'use strict'

const qs = require('querystring')

async function landingPage(rp, env, code) {
  if (!rp)
    throw new Error('Minimal request promise is required.')

  if (!env || !env.slackClientId || !env.slackClientSecret || !env.redirectUrl)
    throw new Error('`env` object is required and it should contain `slackClientId`, `slackClientSecret` and `redirectUrl`')

  if (!code)
    throw new Error('Code is required')

  await rp.post('https://slack.com/api/oauth.access', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: qs.encode({
      client_id: env.slackClientId,
      client_secret: env.slackClientSecret,
      code: code,
      redirect_uri: env.redirectUrl
    })
  })

  return env.redirectUrl
}

module.exports = landingPage
