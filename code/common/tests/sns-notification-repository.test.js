'use strict'

const aws = require('aws-sdk')
const UnderTest = require('../src/sns-notification-repository')
aws.config.update({
  region: 'us-east-2'
})

describe('SnsNotificationRepository', () => {
  describe('unit', () => {
    test('should be a class', () => {
      const notification = new UnderTest()
      expect(typeof UnderTest).toBe('function')
      expect(notification instanceof UnderTest).toBeTruthy()
    })

    test('should set a topic ARN', () => {
      const notification = new UnderTest('topic_arn')
      expect(notification.topicArn).toBe('topic_arn')
    })

    test('should set a notification library', () => {
      const notificationMock = {
        publish: () => {}
      }
      const notification = new UnderTest('topic_arn', notificationMock)
      expect(notification.sns).toBe(notificationMock)
    })

    test('should throw an error if send method is invoked without a message', () => {
      expect.assertions(1)
      const notificationMock = {
        publish: jest.fn()
      }
      const notification = new UnderTest('topic_arn', notificationMock)
      expect(notification.send()).rejects.toEqual('Message is required and it should be an object')
    })

    test('should invoke notificationMock.publish', () => {
      expect.assertions(3)
      const notificationMock = {
        publish: jest.fn().mockReturnValue({ promise: () => Promise.resolve('ok') })
      }
      const notification = new UnderTest('topic_arn', notificationMock)
      expect(notification.send({ message: true })).resolves.toEqual('ok')
      expect(notificationMock.publish).toHaveBeenCalledTimes(1)
      expect(notificationMock.publish).toHaveBeenCalledWith({
        Message: '{"message":true}',
        TopicArn: 'topic_arn'
      });
    })
  })

  describe('integration', () => {})
})
