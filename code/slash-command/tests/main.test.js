'use strict'

const underTest = require('../src/main')

describe('slashCommand', () => {
  describe('unit', () => {
    test('should export a function', () => {
      expect(typeof underTest).toBe('function')
    })

    // (slackEvent, notification, headers, requestContext)

    test('should throw if slack event is not provided', async () => {
      expect.assertions(2)
      try { await underTest() } catch (err) {
        expect(err instanceof Error).toBeTruthy()
        expect(err.toString()).toBe('Error: Slack Event is required and it should be an object.')
      }
    })

    test('should throw if slack event is not a query string', async () => {
      expect.assertions(4)
      try { await underTest(123) } catch(err) {
        expect(err instanceof Error).toBeTruthy()
        expect(err.toString()).toBe('Error: Slack Event is required and it should be an object.')
      }

      try { await underTest({}) } catch(err) {
        expect(err instanceof Error).toBeTruthy()
        expect(err.toString()).toBe('Error: Slack Event is required and it should be an object.')
      }
    })

    test('should throw if an instance of notification repository is not provided', async () => {
      expect.assertions(2)
      try { await underTest('slackEvent=true') } catch (err) {
        expect(err instanceof Error).toBeTruthy()
        expect(err.toString()).toBe('Error: An instance of notification repository is required.')
      }
    })

    test('should throw if an instance of notification repository is not valid', async () => {
      expect.assertions(4)
      try { await underTest('slackEvent=true', 123) } catch (err) {
        expect(err instanceof Error).toBeTruthy()
        expect(err.toString()).toBe('Error: An instance of notification repository is required.')
      }

      try { await underTest('slackEvent=true', {}) } catch (err) {
        expect(err instanceof Error).toBeTruthy()
        expect(err.toString()).toBe('Error: An instance of notification repository is required.')
      }
    })

    test('should invoke notification.send', async () => {
      expect.assertions(2)
      const notificationMock = {
        send: jest.fn()
      }
      await underTest('slackEvent=ok', notificationMock)
      expect(notificationMock.send).toHaveBeenCalledTimes(1)
      expect(notificationMock.send).toHaveBeenCalledWith({
        type: 'SLASH_COMMAND',
        payload: { slackEvent: 'ok' },
        metadata: {
          headers: {},
          requestContext: {}
        }
      })
    })

    test('should invoke notification.send with headers', async () => {
      expect.assertions(2)
      const notificationMock = {
        send: jest.fn()
      }
      await underTest('slackEvent=ok', notificationMock, { headers: true })
      expect(notificationMock.send).toHaveBeenCalledTimes(1)
      expect(notificationMock.send).toHaveBeenCalledWith({
        type: 'SLASH_COMMAND',
        payload: { slackEvent: 'ok' },
        metadata: {
          headers: { headers: true },
          requestContext: {}
        }
      })
    })

    test('should invoke notification.send with headers and context', async () => {
      expect.assertions(2)
      const notificationMock = {
        send: jest.fn()
      }
      await underTest('slackEvent=ok', notificationMock, { headers: true }, { context: { something: true } })
      expect(notificationMock.send).toHaveBeenCalledTimes(1)
      expect(notificationMock.send).toHaveBeenCalledWith({
        type: 'SLASH_COMMAND',
        payload: { slackEvent: 'ok' },
        metadata: {
          headers: { headers: true },
          requestContext: { context: { something: true } }
        }
      })
    })
  })

  describe('integration', () => {
    const EventEmitter = require('events')
    class LocalNotificationRepository extends EventEmitter {
      send(data) {
        this.emit('notification', data)
      }
    }

    test('should invoke notification repository', async () => {
      expect.assertions(1)
      const notification = new LocalNotificationRepository()
      notification.on('notification', data => {
        expect(data).toEqual({
          type: 'SLASH_COMMAND',
          payload: {
            test: 'ok',
            vacationTracker: 'awesome'
          },
          metadata: {
            headers: { 'Content-Type': 'application/json' },
            requestContext: {}
          }
        })
      })

      await underTest('test=ok&vacationTracker=awesome', notification, { 'Content-Type': 'application/json' }, {})
    })
  })
})