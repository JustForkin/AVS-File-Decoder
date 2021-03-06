"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var dim = function (message) {
    console.log((isNode) ? chalk_1.default.dim(message) : message);
};
exports.dim = dim;
var error = function (message) {
    console.error((isNode) ? chalk_1.default.red(message) : message);
};
exports.error = error;
var warn = function (message) {
    console.warn((isNode) ? chalk_1.default.yellow(message) : message);
};
exports.warn = warn;
var isNode = new Function('try {return this===global;}catch(e){return false;}');
//# sourceMappingURL=log.js.map