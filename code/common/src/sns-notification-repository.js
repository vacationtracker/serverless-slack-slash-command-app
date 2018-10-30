'use strict'

const aws = require('aws-sdk')
const sns = new aws.SNS()

class SnsNotificationRepository {
  constructor(topicArn, notificationLib = sns) {
    this.topicArn = topicArn
    this.sns = notificationLib
  }

  send(message) {
    return this.sns
      .publish({
        Message: JSON.stringify(message),
        TopicArn: this.topicArn
      })
      .promise()
  }
}

module.exports = SnsNotificationRepository
