const config = require("../facebook.json")
const { assert } = require("chai").use(require("chai-as-promised"))
const facebookNinja = require("../lib/facebookNinja")
require("co-mocha")

describe("facebookNinja", () => {

  it("Should be a function", () => {
    assert.isFunction(facebookNinja)
  })

  it("Do not pass function with first argument \"\"", () => {
    return assert.isRejected(facebookNinja(""))
  })

  it("Do not pass function with first argument {}", () => {
    return assert.isRejected(facebookNinja({}))
  })

  it("Do not pass function with first argument []", () => {
    return assert.isRejected(facebookNinja([]))
  })

  it("Do not pass function without first argument", () => {
    return assert.isRejected(facebookNinja())
  })

  it("Make two valid request", function*() {

    const response = yield facebookNinja([{ api: "me" }, { api: "me/accounts" }], { accessToken: config.me.accessToken })

    assert.isOk(response)
    assert.isObject(response)

    assert.deepPropertyVal(response, "stats.responses.all", 2)
    assert.deepPropertyVal(response, "stats.responses.success", 2)
    assert.deepPropertyVal(response, "stats.responses.fail", 0)
    assert.deepPropertyVal(response, "stats.responses.canceled", 0)
    assert.deepPropertyVal(response, "stats.responses.canceled", 0)

  })

})