'use strict'

const qs = require('querystring')
const underTest = require('../src/main')

describe('landingPage', () => {
  describe('unit', () => {
    test('should throw an error if minimal-request-promise is not provided', async () => {
      expect.assertions(1)
      try {
        await underTest()
      } catch(err) {
        expect(err.message).toBe('Minimal request promise is required.')
      }
    })

    test('should throw an error if env is not provided', async () => {
      expect.assertions(4)

      try {
        await underTest({})
      } catch(err) {
        expect(err.message).toBe('`env` object is required and it should contain `slackClientId`, `slackClientSecret` and `redirectUrl`')
      }
      
      try {
        await underTest({}, {})
      } catch(err) {
        expect(err.message).toBe('`env` object is required and it should contain `slackClientId`, `slackClientSecret` and `redirectUrl`')
      }
      
      try {
        await underTest({}, { slackClientId: '123' })
      } catch (err) {
        expect(err.message).toBe('`env` object is required and it should contain `slackClientId`, `slackClientSecret` and `redirectUrl`')
      }
      
      try {
        await underTest({}, { slackClientId: '123', slackClientSecret: 'secret' })
      } catch (err) {
        expect(err.message).toBe('`env` object is required and it should contain `slackClientId`, `slackClientSecret` and `redirectUrl`')
      }
    })

    test('should throw an error if code is not provided', async () => {
      expect.assertions(1)
      try {
        await underTest({}, { slackClientId: '123', slackClientSecret: 'secret', redirectUrl: 'http://example.com' })
      } catch(err) {
        expect(err.message).toBe('Code is required')
      }
    })
    
    test('should invoke rp.post', async () => {
      expect.assertions(3)
      const rpMock = {
        post: jest.fn()
      }

      const result = await underTest(rpMock, { slackClientId: '123', slackClientSecret: 'secret', redirectUrl: 'https://example.com' }, 'code')

      expect(result).toBe('https://example.com');
      expect(rpMock.post).toHaveBeenCalledTimes(1)
      expect(rpMock.post).toHaveBeenCalledWith('https://slack.com/api/oauth.access', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.encode({
          client_id: '123',
          client_secret: 'secret',
          code: 'code',
          redirect_uri: 'https://example.com'
        })
      })
    })
  })
})
