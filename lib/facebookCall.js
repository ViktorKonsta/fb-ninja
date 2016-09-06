const fb = require("fb")
const isPlainObject = require("lodash.isplainobject")

/**
 * facebookCall
 *
 * It's one time facebook batch request.
 * Note that this internal function is for making
 * batch requests only since it returns special
 * object as a result.
 *
 * @Promise
 * @param {Object|Array} params Request parameters
 * @return {Promise}
 */
module.exports = function(params = {}) {

  const url = params.url

  const method = params.method
    ? params.method.toLowerCase()
    : "GET"

  const body = body && isPlainObject(body)
    ? body
    : {}

  return new Promise((resolve, reject) => {
    fb.napi(url, method, body, (err, responses) => {

      if (err) {
        return reject({
          status: "Error",
          action: "FACEBOOK_REQUEST",
          context: params,
          message: JSON.parse(err.message).error
        })
      }

      resolve(responses.map(x => ({
        code: x.code,
        request: params,
        response: JSON.parse(x.body)
      })))

    })
  })

}