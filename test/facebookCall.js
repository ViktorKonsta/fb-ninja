const config = require("../facebook.json")
const { assert } = require("chai").use(require("chai-as-promised"))
const facebookCall = require("../lib/facebookCall")
require("co-mocha")

describe("facebookCall", () => {

  it("Should be a function", () => {

    assert.isFunction(facebookCall)

  })

  it("Check access token quickly", () => {

    assert.isOk(config.me.accessToken)
    assert.isString(config.me.accessToken)

  })

  it("Make one valid facebook request", function*() {

    const response = yield facebookCall({ api: "me", body: { access_token: config.me.accessToken } })

    assert.isObject(response)
    assert.isOk(response)
    assert.property(response, "id")
    assert.property(response, "name")

  })

  it("Make one invalid facebook request", function*() {

    const response = facebookCall({ api: "mes", body: { access_token: config.me.accessToken } })
    yield assert.isRejected(response)

  })

  it("Make 3 valid requests", function*() {

    const request = {
      api: "",
      method: "post",
      body: {
        access_token: config.me.accessToken,
        batch: [
          { relative_url: "me", method: "get" },
          { relative_url: "me?fields=id", method: "get" },
          { relative_url: "me?fields=name", method: "get" }
        ]
      }
    }

    const response = yield facebookCall(request)

    assert.isArray(response)

    response.forEach(res => {    
      assert.propertyVal(res, "status", "Success")
      assert.propertyVal(res, "code", 200)
    })

    assert.deepPropertyVal(response[0], "response.name", config.me.name)
    assert.deepPropertyVal(response[0], "response.id", config.me.id)

    assert.deepPropertyVal(response[1], "response.id", config.me.id)

    assert.deepPropertyVal(response[2], "response.name", config.me.name)
    assert.deepPropertyVal(response[2], "response.id", config.me.id)
 
  })

  it("Make 3 invalid requests with invalid access token", function*() {

    const request = {
      api: "",
      method: "post",
      body: {
        access_token: "INVALID_ACCESS_TOKEN",
        batch: [
          { relative_url: "me", method: "get" },
          { relative_url: "me?fields=id", method: "get" },
          { relative_url: "me?fields=name", method: "get" }
        ]
      }
    }

    const response = facebookCall(request)
    yield assert.isRejected(response)

  })

})