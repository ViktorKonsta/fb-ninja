/**
 * isArray
 *
 * This function simply check if given argument
 * is truthy and is this an array or not
 *
 * @param {*} arg Subject to analyze
 * @return {Boolean} Result
 */

module.exports = function(arg) {
  return (arg && Array.isArray(arg))
}