function facebookCall(params = {}) {

  const { url, method = "GET", body = {} } = params

  return new Promise((resolve, reject) => {
    fb.napi(url, method, body, (err, responses) => {

      if (err) {
        return reject({
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