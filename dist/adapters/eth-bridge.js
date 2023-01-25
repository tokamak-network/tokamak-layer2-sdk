"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETHBridgeAdapter = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
var ethers_1 = require("ethers");
var contracts_1 = require("@eth-optimism/contracts");
var core_utils_1 = require("@eth-optimism/core-utils");
var interfaces_1 = require("../interfaces");
var utils_1 = require("../utils");
var standard_bridge_1 = require("./standard-bridge");
/**
 * Bridge adapter for the ETH bridge.
 */
var ETHBridgeAdapter = /** @class */ (function (_super) {
    __extends(ETHBridgeAdapter, _super);
    function ETHBridgeAdapter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.populateTransaction = {
            approve: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new Error("approvals not necessary for ETH bridge");
                });
            }); },
            deposit: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.supportsTokenPair(l1Token, l2Token)];
                        case 1:
                            if (!(_a.sent())) {
                                throw new Error("token pair not supported by bridge");
                            }
                            if ((opts === null || opts === void 0 ? void 0 : opts.recipient) === undefined) {
                                return [2 /*return*/, this.l1Bridge.populateTransaction.depositETH((opts === null || opts === void 0 ? void 0 : opts.l2GasLimit) || 200000, // Default to 200k gas limit.
                                    '0x', __assign(__assign({}, (0, utils_1.omit)((opts === null || opts === void 0 ? void 0 : opts.overrides) || {}, 'value')), { value: amount }))];
                            }
                            else {
                                return [2 /*return*/, this.l1Bridge.populateTransaction.depositETHTo((0, utils_1.toAddress)(opts.recipient), (opts === null || opts === void 0 ? void 0 : opts.l2GasLimit) || 200000, // Default to 200k gas limit.
                                    '0x', __assign(__assign({}, (0, utils_1.omit)((opts === null || opts === void 0 ? void 0 : opts.overrides) || {}, 'value')), { value: amount }))];
                            }
                            return [2 /*return*/];
                    }
                });
            }); },
            withdraw: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.supportsTokenPair(l1Token, l2Token)];
                        case 1:
                            if (!(_a.sent())) {
                                throw new Error("token pair not supported by bridge");
                            }
                            if ((opts === null || opts === void 0 ? void 0 : opts.recipient) === undefined) {
                                return [2 /*return*/, this.l2Bridge.populateTransaction.withdraw((0, utils_1.toAddress)(l2Token), amount, 0, // L1 gas not required.
                                    '0x', __assign(__assign({}, (0, utils_1.omit)((opts === null || opts === void 0 ? void 0 : opts.overrides) || {}, 'value')), { value: this.messenger.bedrock ? amount : 0 }))];
                            }
                            else {
                                return [2 /*return*/, this.l2Bridge.populateTransaction.withdrawTo((0, utils_1.toAddress)(l2Token), (0, utils_1.toAddress)(opts.recipient), amount, 0, // L1 gas not required.
                                    '0x', __assign(__assign({}, (0, utils_1.omit)((opts === null || opts === void 0 ? void 0 : opts.overrides) || {}, 'value')), { value: this.messenger.bedrock ? amount : 0 }))];
                            }
                            return [2 /*return*/];
                    }
                });
            }); },
        };
        return _this;
    }
    ETHBridgeAdapter.prototype.approval = function (l1Token, l2Token, signer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("approval not necessary for ETH bridge");
            });
        });
    };
    ETHBridgeAdapter.prototype.getDepositsByAddress = function (address, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.l1Bridge.queryFilter(this.l1Bridge.filters.ETHDepositInitiated(address), opts === null || opts === void 0 ? void 0 : opts.fromBlock, opts === null || opts === void 0 ? void 0 : opts.toBlock)];
                    case 1:
                        events = _a.sent();
                        return [2 /*return*/, events
                                .map(function (event) {
                                return {
                                    direction: interfaces_1.MessageDirection.L1_TO_L2,
                                    from: event.args.from,
                                    to: event.args.to,
                                    l1Token: ethers_1.ethers.constants.AddressZero,
                                    l2Token: contracts_1.predeploys.OVM_ETH,
                                    amount: event.args.amount,
                                    data: event.args.extraData,
                                    logIndex: event.logIndex,
                                    blockNumber: event.blockNumber,
                                    transactionHash: event.transactionHash,
                                };
                            })
                                .sort(function (a, b) {
                                // Sort descending by block number
                                return b.blockNumber - a.blockNumber;
                            })];
                }
            });
        });
    };
    ETHBridgeAdapter.prototype.getWithdrawalsByAddress = function (address, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.l2Bridge.queryFilter(this.l2Bridge.filters.WithdrawalInitiated(undefined, undefined, address), opts === null || opts === void 0 ? void 0 : opts.fromBlock, opts === null || opts === void 0 ? void 0 : opts.toBlock)];
                    case 1:
                        events = _a.sent();
                        return [2 /*return*/, events
                                .filter(function (event) {
                                // Only find ETH withdrawals.
                                return ((0, core_utils_1.hexStringEquals)(event.args.l1Token, ethers_1.ethers.constants.AddressZero) &&
                                    (0, core_utils_1.hexStringEquals)(event.args.l2Token, contracts_1.predeploys.OVM_ETH));
                            })
                                .map(function (event) {
                                return {
                                    direction: interfaces_1.MessageDirection.L2_TO_L1,
                                    from: event.args.from,
                                    to: event.args.to,
                                    l1Token: event.args.l1Token,
                                    l2Token: event.args.l2Token,
                                    amount: event.args.amount,
                                    data: event.args.extraData,
                                    logIndex: event.logIndex,
                                    blockNumber: event.blockNumber,
                                    transactionHash: event.transactionHash,
                                };
                            })
                                .sort(function (a, b) {
                                // Sort descending by block number
                                return b.blockNumber - a.blockNumber;
                            })];
                }
            });
        });
    };
    ETHBridgeAdapter.prototype.supportsTokenPair = function (l1Token, l2Token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Only support ETH deposits and withdrawals.
                return [2 /*return*/, ((0, core_utils_1.hexStringEquals)((0, utils_1.toAddress)(l1Token), ethers_1.ethers.constants.AddressZero) &&
                        (0, core_utils_1.hexStringEquals)((0, utils_1.toAddress)(l2Token), contracts_1.predeploys.OVM_ETH))];
            });
        });
    };
    return ETHBridgeAdapter;
}(standard_bridge_1.StandardBridgeAdapter));
exports.ETHBridgeAdapter = ETHBridgeAdapter;
