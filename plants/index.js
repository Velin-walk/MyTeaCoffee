/**
 * Plants Index - Re-exports registry for modular bundlers or environments
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = require('./registry.js');
  }
})(typeof self !== 'undefined' ? self : this);
