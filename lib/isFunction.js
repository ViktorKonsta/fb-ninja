/**
 * isFunction
 *
 * Check if argument is truthy and it's type
 * is function
 *
 * @param {*} arg Argument that should be analyzed
 * @return {Boolean} Result
 */

module.exports = function(arg) {
  return (arg && typeof arg === "function")
}