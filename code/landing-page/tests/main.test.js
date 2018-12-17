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
        await underTest({}, { slackClientId: '123', slackClientSecret: 'secret', redirectUrl: 'https://vacationtracker.io' })
      } catch(err) {
        expect(err.message).toBe('Code is required')
      }
    })

    test('should throw an error if notification repository is not provided or is not valid', async () => {
      expect.assertions(2)
      try {
        await underTest({}, { slackClientId: '123', slackClientSecret: 'secret', redirectUrl: 'https://vacationtracker.io' }, 'code')
      } catch (err) {
        expect(err.message).toBe("An instance of notification repository is required");
      }

      try {
        await underTest({}, { slackClientId: '123', slackClientSecret: 'secret', redirectUrl: 'https://vacationtracker.io' }, 'code', { send: 'not a function'})
      } catch (err) {
        expect(err.message).toBe("An instance of notification repository is required");
      }
    })
    
    test('should invoke rp.post', async () => {
      expect.assertions(3)
      const rpMock = {
        post: jest.fn().mockResolvedValue({
          headers: {},
          body: 'ok'
        })
      }
      const notificationMock = {
        send: jest.fn()
      }

      const result = await underTest(rpMock, { slackClientId: '123', slackClientSecret: 'secret', redirectUrl: 'https://vacationtracker.io' }, 'code', notificationMock)

      expect(result).toBe('https://vacationtracker.io');
      expect(rpMock.post).toHaveBeenCalledTimes(1)
      expect(rpMock.post).toHaveBeenCalledWith('https://slack.com/api/oauth.access', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.encode({
          client_id: '123',
          client_secret: 'secret',
          code: 'code'
        })
      })
    })

    test('should invoke notification.send if rp.post resolves', async () => {
      expect.assertions(3)
      const sampleHeaders = {
        'content-type': 'application/json; charset=utf-8',
        'transfer-encoding': 'chunked',
        connection: 'close',
        date: 'Sun, 16 Dec 2018 13:45:12 GMT',
        server: 'Apache',
        vary: 'Accept-Encoding',
        'x-slack-exp': '1',
        'x-slack-backend': 'h',
        'x-slack-router': 'p',
        'referrer-policy': 'no-referrer',
        'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
        'x-slack-req-id': '2823521a-72b4-46b7-86d2-74e6f2964859',
        'x-xss-protection': '0',
        'x-content-type-options': 'nosniff',
        'access-control-allow-origin': '*',
        'x-via': 'haproxy-www-x2wz',
        'x-cache': 'Miss from cloudfront',
        via: '1.1 21d7988e8123cac46b0c570da9d5cfdf.cloudfront.net (CloudFront)',
        'x-amz-cf-id': '76fGKoPLPdVCOuWF5Vodf7a1nYWQMNnZvDN5Ezm039lFVuS6AsQCJg=='
      }
      const rpMock = {
        post: jest.fn().mockResolvedValue({
          headers: sampleHeaders,
          body: 'response body'
        })
      }
      const notificationMock = {
        send: jest.fn()
      }

      const result = await underTest(rpMock, { slackClientId: '123', slackClientSecret: 'secret', redirectUrl: 'https://vacationtracker.io' }, 'code', notificationMock)

      expect(result).toBe('https://vacationtracker.io');
      expect(notificationMock.send).toHaveBeenCalledTimes(1)
      expect(notificationMock.send).toHaveBeenCalledWith({
        type: 'LOGIN',
        payload: 'response body',
        metadata: {
          headers: sampleHeaders
        }
      })
    })

    test('should invoke notification.send with request context', async () => {
      expect.assertions(3)
      const sampleHeaders = {
        'content-type': 'application/json; charset=utf-8'
      }
      const rpMock = {
        post: jest.fn().mockResolvedValue({
          headers: sampleHeaders,
          body: 'response body'
        })
      }
      const notificationMock = {
        send: jest.fn()
      }

      const result = await underTest(rpMock, { slackClientId: '123', slackClientSecret: 'secret', redirectUrl: 'https://vacationtracker.io' }, 'code', notificationMock, { context: true })

      expect(result).toBe('https://vacationtracker.io');
      expect(notificationMock.send).toHaveBeenCalledTimes(1)
      expect(notificationMock.send).toHaveBeenCalledWith({
        type: 'LOGIN',
        payload: 'response body',
        metadata: {
          headers: sampleHeaders,
          requestContext: { context: true }
        }
      })
    })

    test('should throw an error if rp.post fails', async () => {
      expect.assertions(2)
      const sampleHeaders = {
        'content-type': 'application/json; charset=utf-8',
        'transfer-encoding': 'chunked',
        connection: 'close',
        date: 'Sun, 16 Dec 2018 13:45:12 GMT',
        server: 'Apache',
        vary: 'Accept-Encoding',
        'x-slack-exp': '1',
        'x-slack-backend': 'h',
        'x-slack-router': 'p',
        'referrer-policy': 'no-referrer',
        'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
        'x-slack-req-id': '2823521a-72b4-46b7-86d2-74e6f2964859',
        'x-xss-protection': '0',
        'x-content-type-options': 'nosniff',
        'access-control-allow-origin': '*',
        'x-via': 'haproxy-www-x2wz',
        'x-cache': 'Miss from cloudfront',
        via: '1.1 21d7988e8123cac46b0c570da9d5cfdf.cloudfront.net (CloudFront)',
        'x-amz-cf-id': '76fGKoPLPdVCOuWF5Vodf7a1nYWQMNnZvDN5Ezm039lFVuS6AsQCJg=='
      }
      const rpMock = {
        post: jest.fn().mockRejectedValue({
          headers: sampleHeaders,
          body: 'error'
        })
      }
      const notificationMock = {
        send: jest.fn()
      }

      try {
        await underTest(rpMock, { slackClientId: '123', slackClientSecret: 'secret', redirectUrl: 'https://vacationtracker.io' }, 'code', notificationMock)
      } catch(err) {
        expect(err).toEqual({
          headers: sampleHeaders,
          body: 'error'
        })
        expect(notificationMock.send).not.toHaveBeenCalled()
      }
    })
  })
})
