"use strict";
// TODO: A lot of this stuff could probably live in core-utils instead.
// Review this file eventually for stuff that could go into core-utils.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omit = void 0;
/**
 * Returns a copy of the given object ({ ...obj }) with the given keys omitted.
 *
 * @param obj Object to return with the keys omitted.
 * @param keys Keys to omit from the returned object.
 * @returns A copy of the given object with the given keys omitted.
 */
var omit = function (obj) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    var copy = __assign({}, obj);
    for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
        var key = keys_1[_a];
        delete copy[key];
    }
    return copy;
};
exports.omit = omit;
