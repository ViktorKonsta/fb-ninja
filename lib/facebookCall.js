const fb = require('fb')
const isPlainObject = require('lodash.isplainobject')
const isArray = require('lodash.isarray')

module.exports = function (params = {}) {
  const api = params.api

  const method = params.method
    ? params.method.toUpperCase()
    : 'GET'

  const body = params.body && isPlainObject(params.body)
    ? params.body
    : {}

  return new Promise((resolve, reject) => {
    fb.napi(api, method, body, (err, data) => {
      let response

      if (err) {
        return reject({
          status: 'Error',
          action: 'FACEBOOK_REQUEST',
          context: params,
          message: JSON.parse(err.message).error
        })
      }

      if (!data) {
        return reject({
          status: 'Error',
          action: 'FACEBOOK_REQUEST',
          context: params,
          message: 'Response is empty or invalid!'
        })
      }

      if (isArray(data)) {
        response = data.map(x => ({
          status: x.code === 200 ? 'Success' : 'Error',
          code: x.code,
          response: JSON.parse(x.body)
        }))
      } else {
        response = data
      }

      return resolve(response)
    })
  })
}
