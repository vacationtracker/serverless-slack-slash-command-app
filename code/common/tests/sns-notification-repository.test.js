'use strict'

const UnderTest = require('../src/sns-notification-repository')

describe('SnsNotificationRepository', () => {
  describe('unit', () => {
    test('should be a class', () => {
      const notification = new UnderTest()
      expect(typeof UnderTest).toBe('function')
      expect(notification instanceof UnderTest).toBeTruthy()
    })

    test('should set a topic ARN', () => {
      const notification = new UnderTest("topic_arn")
      expect(notification.topicArn).toBe("topic_arn")
    })

    test('should set a notification library', () => {
      const notificationLib = {
        publish: () => {}
      }
      const notification = new UnderTest('topic_arn', notificationLib)
      expect(notification.sns).toBe(notificationLib)
    })
  })
})
