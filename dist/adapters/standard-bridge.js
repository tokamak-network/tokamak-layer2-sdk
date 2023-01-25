"use strict";
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
exports.StandardBridgeAdapter = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
var ethers_1 = require("ethers");
var contracts_1 = require("@eth-optimism/contracts");
var contracts_bedrock_1 = require("@eth-optimism/contracts-bedrock");
var core_utils_1 = require("@eth-optimism/core-utils");
var interfaces_1 = require("../interfaces");
var utils_1 = require("../utils");
/**
 * Bridge adapter for any token bridge that uses the standard token bridge interface.
 */
var StandardBridgeAdapter = /** @class */ (function () {
    /**
     * Creates a StandardBridgeAdapter instance.
     *
     * @param opts Options for the adapter.
     * @param opts.messenger Provider used to make queries related to cross-chain interactions.
     * @param opts.l1Bridge L1 bridge contract.
     * @param opts.l2Bridge L2 bridge contract.
     */
    function StandardBridgeAdapter(opts) {
        var _this = this;
        this.populateTransaction = {
            approve: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.supportsTokenPair(l1Token, l2Token)];
                        case 1:
                            if (!(_a.sent())) {
                                throw new Error("token pair not supported by bridge");
                            }
                            token = new ethers_1.Contract((0, utils_1.toAddress)(l1Token), (0, contracts_bedrock_1.getContractInterface)('OptimismMintableERC20'), // Any ERC20 will do
                            this.messenger.l1Provider);
                            return [2 /*return*/, token.populateTransaction.approve(this.l1Bridge.address, amount, (opts === null || opts === void 0 ? void 0 : opts.overrides) || {})];
                    }
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
                                return [2 /*return*/, this.l1Bridge.populateTransaction.depositERC20((0, utils_1.toAddress)(l1Token), (0, utils_1.toAddress)(l2Token), amount, (opts === null || opts === void 0 ? void 0 : opts.l2GasLimit) || 200000, // Default to 200k gas limit.
                                    '0x', // No data.
                                    (opts === null || opts === void 0 ? void 0 : opts.overrides) || {})];
                            }
                            else {
                                return [2 /*return*/, this.l1Bridge.populateTransaction.depositERC20To((0, utils_1.toAddress)(l1Token), (0, utils_1.toAddress)(l2Token), (0, utils_1.toAddress)(opts.recipient), amount, (opts === null || opts === void 0 ? void 0 : opts.l2GasLimit) || 200000, // Default to 200k gas limit.
                                    '0x', // No data.
                                    (opts === null || opts === void 0 ? void 0 : opts.overrides) || {})];
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
                                    '0x', // No data.
                                    (opts === null || opts === void 0 ? void 0 : opts.overrides) || {})];
                            }
                            else {
                                return [2 /*return*/, this.l2Bridge.populateTransaction.withdrawTo((0, utils_1.toAddress)(l2Token), (0, utils_1.toAddress)(opts.recipient), amount, 0, // L1 gas not required.
                                    '0x', // No data.
                                    (opts === null || opts === void 0 ? void 0 : opts.overrides) || {})];
                            }
                            return [2 /*return*/];
                    }
                });
            }); },
        };
        this.estimateGas = {
            approve: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.messenger.l1Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.approve(l1Token, l2Token, amount, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
            deposit: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.messenger.l1Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.deposit(l1Token, l2Token, amount, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
            withdraw: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.messenger.l2Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.withdraw(l1Token, l2Token, amount, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
        };
        this.messenger = opts.messenger;
        this.l1Bridge = new ethers_1.Contract((0, utils_1.toAddress)(opts.l1Bridge), (0, contracts_bedrock_1.getContractInterface)('L1StandardBridge'), this.messenger.l1Provider);
        this.l2Bridge = new ethers_1.Contract((0, utils_1.toAddress)(opts.l2Bridge), (0, contracts_bedrock_1.getContractInterface)('L2StandardBridge'), this.messenger.l2Provider);
    }
    StandardBridgeAdapter.prototype.getDepositsByAddress = function (address, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.l1Bridge.queryFilter(this.l1Bridge.filters.ERC20DepositInitiated(undefined, undefined, address), opts === null || opts === void 0 ? void 0 : opts.fromBlock, opts === null || opts === void 0 ? void 0 : opts.toBlock)];
                    case 1:
                        events = _a.sent();
                        return [2 /*return*/, events
                                .filter(function (event) {
                                // Specifically filter out ETH. ETH deposits and withdrawals are handled by the ETH bridge
                                // adapter. Bridges that are not the ETH bridge should not be able to handle or even
                                // present ETH deposits or withdrawals.
                                return (!(0, core_utils_1.hexStringEquals)(event.args.l1Token, ethers_1.ethers.constants.AddressZero) &&
                                    !(0, core_utils_1.hexStringEquals)(event.args.l2Token, contracts_1.predeploys.OVM_ETH));
                            })
                                .map(function (event) {
                                return {
                                    direction: interfaces_1.MessageDirection.L1_TO_L2,
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
    StandardBridgeAdapter.prototype.getWithdrawalsByAddress = function (address, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.l2Bridge.queryFilter(this.l2Bridge.filters.WithdrawalInitiated(undefined, undefined, address), opts === null || opts === void 0 ? void 0 : opts.fromBlock, opts === null || opts === void 0 ? void 0 : opts.toBlock)];
                    case 1:
                        events = _a.sent();
                        return [2 /*return*/, events
                                .filter(function (event) {
                                // Specifically filter out ETH. ETH deposits and withdrawals are handled by the ETH bridge
                                // adapter. Bridges that are not the ETH bridge should not be able to handle or even
                                // present ETH deposits or withdrawals.
                                return (!(0, core_utils_1.hexStringEquals)(event.args.l1Token, ethers_1.ethers.constants.AddressZero) &&
                                    !(0, core_utils_1.hexStringEquals)(event.args.l2Token, contracts_1.predeploys.OVM_ETH));
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
    StandardBridgeAdapter.prototype.supportsTokenPair = function (l1Token, l2Token) {
        return __awaiter(this, void 0, void 0, function () {
            var contract, remoteL1Token, remoteL2Bridge, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        contract = new ethers_1.Contract((0, utils_1.toAddress)(l2Token), (0, contracts_bedrock_1.getContractInterface)('OptimismMintableERC20'), this.messenger.l2Provider);
                        // Don't support ETH deposits or withdrawals via this bridge.
                        if ((0, core_utils_1.hexStringEquals)((0, utils_1.toAddress)(l1Token), ethers_1.ethers.constants.AddressZero) ||
                            (0, core_utils_1.hexStringEquals)((0, utils_1.toAddress)(l2Token), contracts_1.predeploys.OVM_ETH)) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, contract.l1Token()];
                    case 1:
                        remoteL1Token = _a.sent();
                        if (!(0, core_utils_1.hexStringEquals)(remoteL1Token, (0, utils_1.toAddress)(l1Token))) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, contract.l2Bridge()];
                    case 2:
                        remoteL2Bridge = _a.sent();
                        if (!(0, core_utils_1.hexStringEquals)(remoteL2Bridge, this.l2Bridge.address)) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                    case 3:
                        err_1 = _a.sent();
                        // If the L2 token is not an L2StandardERC20, it may throw an error. If there's a call
                        // exception then we assume that the token is not supported. Other errors are thrown. Since
                        // the JSON-RPC API is not well-specified, we need to handle multiple possible error codes.
                        if (err_1.message.toString().includes('CALL_EXCEPTION') ||
                            err_1.stack.toString().includes('execution reverted')) {
                            return [2 /*return*/, false];
                        }
                        else {
                            throw err_1;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StandardBridgeAdapter.prototype.approval = function (l1Token, l2Token, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var token, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.supportsTokenPair(l1Token, l2Token)];
                    case 1:
                        if (!(_c.sent())) {
                            throw new Error("token pair not supported by bridge");
                        }
                        token = new ethers_1.Contract((0, utils_1.toAddress)(l1Token), (0, contracts_bedrock_1.getContractInterface)('OptimismMintableERC20'), // Any ERC20 will do
                        this.messenger.l1Provider);
                        _b = (_a = token).allowance;
                        return [4 /*yield*/, signer.getAddress()];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent(), this.l1Bridge.address])];
                }
            });
        });
    };
    StandardBridgeAdapter.prototype.approve = function (l1Token, l2Token, amount, signer, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = signer).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.approve(l1Token, l2Token, amount, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    StandardBridgeAdapter.prototype.deposit = function (l1Token, l2Token, amount, signer, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = signer).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.deposit(l1Token, l2Token, amount, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    StandardBridgeAdapter.prototype.withdraw = function (l1Token, l2Token, amount, signer, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = signer).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.withdraw(l1Token, l2Token, amount, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    return StandardBridgeAdapter;
}());
exports.StandardBridgeAdapter = StandardBridgeAdapter;
