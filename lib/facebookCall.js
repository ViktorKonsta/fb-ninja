const fb = require("fb")
const isPlainObject = require("lodash.isplainobject")
const isArray = require("lodash.isarray")

/**
 * facebookCall
 *
 * It's one time facebook batch request.
 * Note that this internal function is for making
 * batch requests however it can handle alone requests.
 *
 * @Promise
 * @param {Object|Array} params Request parameters
 * @return {Promise}
 */
module.exports = function(params = {}) {

  const api = params.api

  const method = params.method
    ? params.method.toUpperCase()
    : "GET"

  const body = body && isPlainObject(body)
    ? body
    : {}

  return new Promise((resolve, reject) => {
    fb.napi(api, method, body, (err, data) => {

      let response

      if (err) {
        return reject({
          status: "Error",
          action: "FACEBOOK_REQUEST",
          context: params,
          message: JSON.parse(err.message).error
        })
      }

      if (!data) {
        return reject({
          status: "Error",
          action: "FACEBOOK_REQUEST",
          context: params,
          message: "Response is empty or incorrect"
        })
      }

      if (isArray(data)) {
        response = data.map(x => ({
          status: x.code === 200 ? "Success" : "Error",
          code: x.code,
          request: params,
          response: JSON.parse(x.body)
        }))
      } else {
        response = data
      }

      return resolve(response)

    })
  })

}