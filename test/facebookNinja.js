const config = require("../facebook.json")
const { assert } = require("chai").use(require("chai-as-promised"))
const facebookNinja = require("../lib/facebookNinja")
require("co-mocha")

describe("facebookCall", () => {

  it("facebookNinja should be a function", () => {

    assert.isFunction(facebookNinja)

  })

})