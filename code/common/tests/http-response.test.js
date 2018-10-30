'use strict'

const underTest = require('../src/http-response')

describe('HTTP Response', () => {
  test('should be a function', () => {
    expect(typeof underTest).toBe('function')
  })

  test('should return response with status 204 if no arguments are passed', () => {
    expect(underTest()).toEqual({
      statusCode: 204,
      body: '',
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '86400'
      }
    })
  })

  test('should return response with status 200 if only body is provided', () => {
    expect(underTest('ok')).toEqual({
      statusCode: 200,
      body: 'ok',
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '86400'
      }
    })
  })

  test('should set a custom status if it is provided', () => {
    expect(underTest('not ok', 400)).toEqual({
      statusCode: 400,
      body: 'not ok',
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '86400'
      }
    })
  })

  test('should set custom headers if they are provided', () => {
    expect(underTest('', 302, { Location: 'https://github.com' })).toEqual({
      statusCode: 302,
      body: '',
      headers: { Location: 'https://github.com' }
    })
  })

  test('should convert Error object body to a string', () => {
    expect(underTest(new Error('error'), 400)).toEqual({
      statusCode: 400,
      body: 'Error: error',
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '86400'
      }
    })
  })
})
