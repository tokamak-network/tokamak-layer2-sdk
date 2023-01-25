"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashLowLevelMessage = void 0;
var core_utils_1 = require("@eth-optimism/core-utils");
/**
 * Utility for hashing a LowLevelMessage object.
 *
 * @param message LowLevelMessage object to hash.
 * @returns Hash of the given LowLevelMessage.
 */
var hashLowLevelMessage = function (message) {
    return (0, core_utils_1.hashWithdrawal)(message.messageNonce, message.sender, message.target, message.value, message.minGasLimit, message.message);
};
exports.hashLowLevelMessage = hashLowLevelMessage;
