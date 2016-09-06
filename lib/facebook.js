const fb = require("fb")
const _ = require("lodash")
const co = require("co")
const error = require("./notificator").error
const delay = require("./delay").delay

function facebookCall(params = {}) {

  const { url, method = "GET", body = {} } = params

  return new Promise((resolve, reject) => {
    fb.napi(url, method, body, (err, responses) => {

      if (err) {
        return reject(error({
          action: "FACEBOOK_REQUEST",
          context: params,
          message: JSON.parse(err.message).error
        }))
      }

      resolve(responses.map(x => ({
        code: x.code,
        request: params,
        response: JSON.parse(x.body)
      })))

    })
  })

}

const facebook = co.wrap(function*(data, options = {}) {
  
  // chunk is the same as request

  if (!data) {
    throw new Error("first argument should be specified")
  }

  const a = +new Date()

  const {

    // include headers in response or not
    includeHeaders = false,

    // top level facebook app id
    appId = null,

    // count of objects to send in one chunk (batch)
    chunkSize = 30,

    // timeout between response and new request (API Call)
    timeout = 1000 * 60,

    // top level access token
    accessToken = "",

    // top level method
    method = "POST",

    // top level url
    api = "",

    // before very first loop
    before = null,

    // after last loop
    after = null,

    // before each loop
    beforeEach = null,

    // after each loop
    afterEach = null,

    // retry API calls that fails
    retry = true,

  } = options

  const canceled = []
  const docs = _.isArray(data) ? data : [data]
  const chunks = _.chunk(docs, chunkSize)

  const isBefore = _.isFunction(before)
  const isAfter = _.isFunction(after)
  const isBeforeEach = _.isFunction(beforeEach)
  const isAfterEach = _.isFunction(afterEach)

  const responses = {
    all: [],
    success: [],
    fail: []
  }

  const requests = chunks.map(chunk => {

    const request = {
      url: api,
      method,
      body: {
        include_headers: includeHeaders,
        batch: []
      }
    }

    if (appId) {
      request.body.app_id = appId
    }

    request.body.batch = chunk.map(doc => {

      doc.method = doc.method ? doc.method.toUpperCase() : "GET"

      const batch = {
        relative_url: doc.api,
        method: doc.method
      }

      if (accessToken) {
        request.body.access_token = accessToken
      }

      if (doc.method.match(/POST|PUT/g)) {
        batch.body = ""
        batch.body += doc.message ? `message=${doc.message}&` : ""
        batch.body += doc.link ? `link=${doc.link}&` : ""
        batch.body += doc.accessToken ? `access_token=${doc.accessToken}` : ""
      }

      return batch

    })

    return request

  })

  if (isBefore) {
    try {
      yield before()
    } catch (err) {
      throw new Error(err)
    }
  }

  for (let chunkIndex = 0; chunkIndex < requests.length; chunkIndex++) {

    let batchResponses
    const a = +new Date()
    const loopCanceled = []
    const request = requests[chunkIndex]
    const isNextIteration = chunkIndex + 1 < requests.length

    const loopResponses = {
      all: [],
      success: [],
      fail: []
    }

    if (isBeforeEach) {
      try {
        yield beforeEach()
      } catch (err) {
        throw err
      }
    }

    try {
      batchResponses = yield facebookCall(request)
    } catch (err) {
      throw err
    }

    batchResponses.forEach((response, responseIndex) => {

      const relatedDoc = chunks[chunkIndex][responseIndex]
      responses.all.push(response)
      loopResponses.all.push(response)

      if (response.response && response.code === 200) {
        responses.success.push(response)
        loopResponses.success.push(response)
      } else {
        responses.fail.push(response)
        loopResponses.fail.push(response)
        if (_.isNull(response.response)) {
          canceled.push(relatedDoc)
          loopCanceled.push(relatedDoc)
        }
      }

    })

    if (isAfterEach) {
      try {
        yield afterEach({
          responses: loopResponses,
          canceled: loopCanceled,
          request,
          options,
          chunk: chunks[chunkIndex],
          chunkIndex,
          isNextIteration,
          stats: {
            ms: +new Date() - a,
            chunkSize: chunks[chunkIndex].length,
            batchSize: request.body.batch.length,
            responses: {
              all: loopResponses.all.length,
              success: loopResponses.success.length,
              fail: loopResponses.fail.length
            }
          }
        })
      } catch (err) {
        throw err
      }
    }

    if (isNextIteration) {
      yield delay(timeout)
    }

  }

  if (retry && canceled.length) {
    setTimeout(() => facebook(canceled, options), timeout)
  }

  if (isAfter) {
    try {
      yield after()
    } catch (err) {
      throw new Error(err)
    }
  }

  const public = {

    responses,
    canceled,
    requests,
    options,
    chunks,
    docs,

    stats: {
      ms: +new Date() - a,
      docs: docs.length,
      chunks: chunks.length,
      requests: requests.length,
      responses: {
        all: responses.all.length,
        success: responses.success.length,
        fail: responses.fail.length,
        canceled: canceled.length,
      },
    },

  }

  return public

})

module.exports = { fb, facebook }