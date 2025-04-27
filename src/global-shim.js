// src/global-shim.js
// This file provides a shim for the global object in environments that don't have it
module.exports = (typeof global !== 'undefined' ? global : 
    typeof window !== 'undefined' ? window : 
    typeof self !== 'undefined' ? self : {});