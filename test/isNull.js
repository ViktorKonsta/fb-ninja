const { assert } = require("chai")
const isNull = require("../lib/isNull")

describe("isNull", () => {

  it("Should be a function", () => {
    assert.isFunction(isNull)
  })

  it("Expect isNull(null) return true", () => {
    assert.isTrue(isNull(null))
  })

  it("Expect isNull(\"null\") return false", () => {
    assert.isFalse(isNull("null"))
  })

  it("Expect isNull(12) return false", () => {
    assert.isFalse(isNull(12))
  })

  it("Expect isNull(false) return false", () => {
    assert.isFalse(isNull(false))
  })

  it("Expect isNull([false, true, null]) return false", () => {
    assert.isFalse(isNull([false, true, null]))
  })

  it("Expect isNull(function(){}) return false", () => {
    assert.isFalse(isNull(function(){}))
  })

  it("Expect isNull(function(){ return null }) return false", () => {
    assert.isFalse(isNull(function(){ return null }))
  })

  it("Expect isNull((function(){ return null })()) return true", () => {
    assert.isTrue(isNull((function(){ return null })()))
  })

})