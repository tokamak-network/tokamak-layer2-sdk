"use strict";
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
exports.CrossChainMessenger = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
var abstract_provider_1 = require("@ethersproject/abstract-provider");
var ethers_1 = require("ethers");
var core_utils_1 = require("@eth-optimism/core-utils");
var contracts_1 = require("@eth-optimism/contracts");
var rlp = require("rlp");
var interfaces_1 = require("./interfaces");
var utils_1 = require("./utils");
var CrossChainMessenger = /** @class */ (function () {
    /**
     * Creates a new CrossChainProvider instance.
     *
     * @param opts Options for the provider.
     * @param opts.l1SignerOrProvider Signer or Provider for the L1 chain, or a JSON-RPC url.
     * @param opts.l2SignerOrProvider Signer or Provider for the L2 chain, or a JSON-RPC url.
     * @param opts.l1ChainId Chain ID for the L1 chain.
     * @param opts.l2ChainId Chain ID for the L2 chain.
     * @param opts.depositConfirmationBlocks Optional number of blocks before a deposit is confirmed.
     * @param opts.l1BlockTimeSeconds Optional estimated block time in seconds for the L1 chain.
     * @param opts.contracts Optional contract address overrides.
     * @param opts.bridges Optional bridge address list.
     * @param opts.bedrock Whether or not to enable Bedrock compatibility.
     */
    function CrossChainMessenger(opts) {
        var _this = this;
        var _a;
        /**
         * Object that holds the functions that generate transactions to be signed by the user.
         * Follows the pattern used by ethers.js.
         */
        this.populateTransaction = {
            /**
             * Generates a transaction that sends a given cross chain message. This transaction can be signed
             * and executed by a signer.
             *
             * @param message Cross chain message to send.
             * @param opts Additional options.
             * @param opts.l2GasLimit Optional gas limit to use for the transaction on L2.
             * @param opts.overrides Optional transaction overrides.
             * @returns Transaction that can be signed and executed to send the message.
             */
            sendMessage: function (message, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!(message.direction === interfaces_1.MessageDirection.L1_TO_L2)) return [3 /*break*/, 3];
                            _b = (_a = this.contracts.l1.L1CrossDomainMessenger.populateTransaction).sendMessage;
                            _c = [message.target,
                                message.message];
                            _d = (opts === null || opts === void 0 ? void 0 : opts.l2GasLimit);
                            if (_d) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.estimateL2MessageGasLimit(message)];
                        case 1:
                            _d = (_e.sent());
                            _e.label = 2;
                        case 2: return [2 /*return*/, _b.apply(_a, _c.concat([_d, (opts === null || opts === void 0 ? void 0 : opts.overrides) || {}]))];
                        case 3: return [2 /*return*/, this.contracts.l2.L2CrossDomainMessenger.populateTransaction.sendMessage(message.target, message.message, 0, // Gas limit goes unused when sending from L2 to L1
                            (opts === null || opts === void 0 ? void 0 : opts.overrides) || {})];
                    }
                });
            }); },
            /**
             * Generates a transaction that resends a given cross chain message. Only applies to L1 to L2
             * messages. This transaction can be signed and executed by a signer.
             *
             * @param message Cross chain message to resend.
             * @param messageGasLimit New gas limit to use for the message.
             * @param opts Additional options.
             * @param opts.overrides Optional transaction overrides.
             * @returns Transaction that can be signed and executed to resend the message.
             */
            resendMessage: function (message, messageGasLimit, opts) { return __awaiter(_this, void 0, void 0, function () {
                var resolved, legacyL1XDM;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                        case 1:
                            resolved = _a.sent();
                            if (resolved.direction === interfaces_1.MessageDirection.L2_TO_L1) {
                                throw new Error("cannot resend L2 to L1 message");
                            }
                            if (this.bedrock) {
                                return [2 /*return*/, this.populateTransaction.finalizeMessage(resolved, __assign(__assign({}, (opts || {})), { overrides: __assign(__assign({}, opts === null || opts === void 0 ? void 0 : opts.overrides), { gasLimit: messageGasLimit }) }))];
                            }
                            else {
                                legacyL1XDM = new ethers_1.ethers.Contract(this.contracts.l1.L1CrossDomainMessenger.address, (0, contracts_1.getContractInterface)('L1CrossDomainMessenger'), this.l1SignerOrProvider);
                                return [2 /*return*/, legacyL1XDM.populateTransaction.replayMessage(resolved.target, resolved.sender, resolved.message, resolved.messageNonce, resolved.minGasLimit, messageGasLimit, (opts === null || opts === void 0 ? void 0 : opts.overrides) || {})];
                            }
                            return [2 /*return*/];
                    }
                });
            }); },
            /**
             * Generates a message proving transaction that can be signed and executed. Only
             * applicable for L2 to L1 messages.
             *
             * @param message Message to generate the proving transaction for.
             * @param opts Additional options.
             * @param opts.overrides Optional transaction overrides.
             * @returns Transaction that can be signed and executed to prove the message.
             */
            proveMessage: function (message, opts) { return __awaiter(_this, void 0, void 0, function () {
                var resolved, withdrawal, proof;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                        case 1:
                            resolved = _a.sent();
                            if (resolved.direction === interfaces_1.MessageDirection.L1_TO_L2) {
                                throw new Error('cannot finalize L1 to L2 message');
                            }
                            if (!this.bedrock) {
                                throw new Error('message proving only applies after the bedrock upgrade');
                            }
                            return [4 /*yield*/, this.toLowLevelMessage(resolved)];
                        case 2:
                            withdrawal = _a.sent();
                            return [4 /*yield*/, this.getBedrockMessageProof(resolved)];
                        case 3:
                            proof = _a.sent();
                            return [2 /*return*/, this.contracts.l1.OptimismPortal.populateTransaction.proveWithdrawalTransaction([
                                    withdrawal.messageNonce,
                                    withdrawal.sender,
                                    withdrawal.target,
                                    withdrawal.value,
                                    withdrawal.minGasLimit,
                                    withdrawal.message,
                                ], proof.l2OutputIndex, [
                                    proof.outputRootProof.version,
                                    proof.outputRootProof.stateRoot,
                                    proof.outputRootProof.messagePasserStorageRoot,
                                    proof.outputRootProof.latestBlockhash,
                                ], proof.withdrawalProof, (opts === null || opts === void 0 ? void 0 : opts.overrides) || {})];
                    }
                });
            }); },
            /**
             * Generates a message finalization transaction that can be signed and executed. Only
             * applicable for L2 to L1 messages. Will throw an error if the message has not completed
             * its challenge period yet.
             *
             * @param message Message to generate the finalization transaction for.
             * @param opts Additional options.
             * @param opts.overrides Optional transaction overrides.
             * @returns Transaction that can be signed and executed to finalize the message.
             */
            finalizeMessage: function (message, opts) { return __awaiter(_this, void 0, void 0, function () {
                var resolved, withdrawal, proof, legacyL1XDM;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                        case 1:
                            resolved = _a.sent();
                            if (resolved.direction === interfaces_1.MessageDirection.L1_TO_L2) {
                                throw new Error("cannot finalize L1 to L2 message");
                            }
                            if (!this.bedrock) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.toLowLevelMessage(resolved)];
                        case 2:
                            withdrawal = _a.sent();
                            return [2 /*return*/, this.contracts.l1.OptimismPortal.populateTransaction.finalizeWithdrawalTransaction([
                                    withdrawal.messageNonce,
                                    withdrawal.sender,
                                    withdrawal.target,
                                    withdrawal.value,
                                    withdrawal.minGasLimit,
                                    withdrawal.message,
                                ], (opts === null || opts === void 0 ? void 0 : opts.overrides) || {})];
                        case 3: return [4 /*yield*/, this.getMessageProof(resolved)];
                        case 4:
                            proof = _a.sent();
                            legacyL1XDM = new ethers_1.ethers.Contract(this.contracts.l1.L1CrossDomainMessenger.address, (0, contracts_1.getContractInterface)('L1CrossDomainMessenger'), this.l1SignerOrProvider);
                            return [2 /*return*/, legacyL1XDM.populateTransaction.relayMessage(resolved.target, resolved.sender, resolved.message, resolved.messageNonce, proof, (opts === null || opts === void 0 ? void 0 : opts.overrides) || {})];
                    }
                });
            }); },
            /**
             * Generates a transaction for depositing some ETH into the L2 chain.
             *
             * @param amount Amount of ETH to deposit.
             * @param opts Additional options.
             * @param opts.recipient Optional address to receive the funds on L2. Defaults to sender.
             * @param opts.l2GasLimit Optional gas limit to use for the transaction on L2.
             * @param opts.overrides Optional transaction overrides.
             * @returns Transaction that can be signed and executed to deposit the ETH.
             */
            depositETH: function (amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bridges.ETH.populateTransaction.deposit(ethers_1.ethers.constants.AddressZero, contracts_1.predeploys.OVM_ETH, amount, opts)];
                });
            }); },
            /**
             * Generates a transaction for withdrawing some ETH back to the L1 chain.
             *
             * @param amount Amount of ETH to withdraw.
             * @param opts Additional options.
             * @param opts.recipient Optional address to receive the funds on L1. Defaults to sender.
             * @param opts.overrides Optional transaction overrides.
             * @returns Transaction that can be signed and executed to withdraw the ETH.
             */
            withdrawETH: function (amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.bridges.ETH.populateTransaction.withdraw(ethers_1.ethers.constants.AddressZero, contracts_1.predeploys.OVM_ETH, amount, opts)];
                });
            }); },
            /**
             * Generates a transaction for approving some tokens to deposit into the L2 chain.
             *
             * @param l1Token The L1 token address.
             * @param l2Token The L2 token address.
             * @param amount Amount of the token to approve.
             * @param opts Additional options.
             * @param opts.overrides Optional transaction overrides.
             * @returns Transaction response for the approval transaction.
             */
            approveERC20: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var bridge;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getBridgeForTokenPair(l1Token, l2Token)];
                        case 1:
                            bridge = _a.sent();
                            return [2 /*return*/, bridge.populateTransaction.approve(l1Token, l2Token, amount, opts)];
                    }
                });
            }); },
            /**
             * Generates a transaction for depositing some ERC20 tokens into the L2 chain.
             *
             * @param l1Token Address of the L1 token.
             * @param l2Token Address of the L2 token.
             * @param amount Amount to deposit.
             * @param opts Additional options.
             * @param opts.recipient Optional address to receive the funds on L2. Defaults to sender.
             * @param opts.l2GasLimit Optional gas limit to use for the transaction on L2.
             * @param opts.overrides Optional transaction overrides.
             * @returns Transaction that can be signed and executed to deposit the tokens.
             */
            depositERC20: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var bridge;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getBridgeForTokenPair(l1Token, l2Token)];
                        case 1:
                            bridge = _a.sent();
                            return [2 /*return*/, bridge.populateTransaction.deposit(l1Token, l2Token, amount, opts)];
                    }
                });
            }); },
            /**
             * Generates a transaction for withdrawing some ERC20 tokens back to the L1 chain.
             *
             * @param l1Token Address of the L1 token.
             * @param l2Token Address of the L2 token.
             * @param amount Amount to withdraw.
             * @param opts Additional options.
             * @param opts.recipient Optional address to receive the funds on L1. Defaults to sender.
             * @param opts.overrides Optional transaction overrides.
             * @returns Transaction that can be signed and executed to withdraw the tokens.
             */
            withdrawERC20: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var bridge;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getBridgeForTokenPair(l1Token, l2Token)];
                        case 1:
                            bridge = _a.sent();
                            return [2 /*return*/, bridge.populateTransaction.withdraw(l1Token, l2Token, amount, opts)];
                    }
                });
            }); },
        };
        /**
         * Object that holds the functions that estimates the gas required for a given transaction.
         * Follows the pattern used by ethers.js.
         */
        this.estimateGas = {
            /**
             * Estimates gas required to send a cross chain message.
             *
             * @param message Cross chain message to send.
             * @param opts Additional options.
             * @param opts.l2GasLimit Optional gas limit to use for the transaction on L2.
             * @param opts.overrides Optional transaction overrides.
             * @returns Gas estimate for the transaction.
             */
            sendMessage: function (message, opts) { return __awaiter(_this, void 0, void 0, function () {
                var tx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.populateTransaction.sendMessage(message, opts)];
                        case 1:
                            tx = _a.sent();
                            if (message.direction === interfaces_1.MessageDirection.L1_TO_L2) {
                                return [2 /*return*/, this.l1Provider.estimateGas(tx)];
                            }
                            else {
                                return [2 /*return*/, this.l2Provider.estimateGas(tx)];
                            }
                            return [2 /*return*/];
                    }
                });
            }); },
            /**
             * Estimates gas required to resend a cross chain message. Only applies to L1 to L2 messages.
             *
             * @param message Cross chain message to resend.
             * @param messageGasLimit New gas limit to use for the message.
             * @param opts Additional options.
             * @param opts.overrides Optional transaction overrides.
             * @returns Gas estimate for the transaction.
             */
            resendMessage: function (message, messageGasLimit, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.l1Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.resendMessage(message, messageGasLimit, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
            /**
             * Estimates gas required to prove a cross chain message. Only applies to L2 to L1 messages.
             *
             * @param message Message to generate the proving transaction for.
             * @param opts Additional options.
             * @param opts.overrides Optional transaction overrides.
             * @returns Gas estimate for the transaction.
             */
            proveMessage: function (message, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.l1Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.proveMessage(message, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
            /**
             * Estimates gas required to finalize a cross chain message. Only applies to L2 to L1 messages.
             *
             * @param message Message to generate the finalization transaction for.
             * @param opts Additional options.
             * @param opts.overrides Optional transaction overrides.
             * @returns Gas estimate for the transaction.
             */
            finalizeMessage: function (message, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.l1Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.finalizeMessage(message, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
            /**
             * Estimates gas required to deposit some ETH into the L2 chain.
             *
             * @param amount Amount of ETH to deposit.
             * @param opts Additional options.
             * @param opts.recipient Optional address to receive the funds on L2. Defaults to sender.
             * @param opts.l2GasLimit Optional gas limit to use for the transaction on L2.
             * @param opts.overrides Optional transaction overrides.
             * @returns Gas estimate for the transaction.
             */
            depositETH: function (amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.l1Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.depositETH(amount, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
            /**
             * Estimates gas required to withdraw some ETH back to the L1 chain.
             *
             * @param amount Amount of ETH to withdraw.
             * @param opts Additional options.
             * @param opts.recipient Optional address to receive the funds on L1. Defaults to sender.
             * @param opts.overrides Optional transaction overrides.
             * @returns Gas estimate for the transaction.
             */
            withdrawETH: function (amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.l2Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.withdrawETH(amount, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
            /**
             * Estimates gas required to approve some tokens to deposit into the L2 chain.
             *
             * @param l1Token The L1 token address.
             * @param l2Token The L2 token address.
             * @param amount Amount of the token to approve.
             * @param opts Additional options.
             * @param opts.overrides Optional transaction overrides.
             * @returns Transaction response for the approval transaction.
             */
            approveERC20: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.l1Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.approveERC20(l1Token, l2Token, amount, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
            /**
             * Estimates gas required to deposit some ERC20 tokens into the L2 chain.
             *
             * @param l1Token Address of the L1 token.
             * @param l2Token Address of the L2 token.
             * @param amount Amount to deposit.
             * @param opts Additional options.
             * @param opts.recipient Optional address to receive the funds on L2. Defaults to sender.
             * @param opts.l2GasLimit Optional gas limit to use for the transaction on L2.
             * @param opts.overrides Optional transaction overrides.
             * @returns Gas estimate for the transaction.
             */
            depositERC20: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.l1Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.depositERC20(l1Token, l2Token, amount, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
            /**
             * Estimates gas required to withdraw some ERC20 tokens back to the L1 chain.
             *
             * @param l1Token Address of the L1 token.
             * @param l2Token Address of the L2 token.
             * @param amount Amount to withdraw.
             * @param opts Additional options.
             * @param opts.recipient Optional address to receive the funds on L1. Defaults to sender.
             * @param opts.overrides Optional transaction overrides.
             * @returns Gas estimate for the transaction.
             */
            withdrawERC20: function (l1Token, l2Token, amount, opts) { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = (_a = this.l2Provider).estimateGas;
                            return [4 /*yield*/, this.populateTransaction.withdrawERC20(l1Token, l2Token, amount, opts)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                    }
                });
            }); },
        };
        this.bedrock = (_a = opts.bedrock) !== null && _a !== void 0 ? _a : false;
        this.l1SignerOrProvider = (0, utils_1.toSignerOrProvider)(opts.l1SignerOrProvider);
        this.l2SignerOrProvider = (0, utils_1.toSignerOrProvider)(opts.l2SignerOrProvider);
        try {
            this.l1ChainId = (0, utils_1.toNumber)(opts.l1ChainId);
        }
        catch (err) {
            throw new Error("L1 chain ID is missing or invalid: ".concat(opts.l1ChainId));
        }
        try {
            this.l2ChainId = (0, utils_1.toNumber)(opts.l2ChainId);
        }
        catch (err) {
            throw new Error("L2 chain ID is missing or invalid: ".concat(opts.l2ChainId));
        }
        this.depositConfirmationBlocks =
            (opts === null || opts === void 0 ? void 0 : opts.depositConfirmationBlocks) !== undefined
                ? (0, utils_1.toNumber)(opts.depositConfirmationBlocks)
                : utils_1.DEPOSIT_CONFIRMATION_BLOCKS[this.l2ChainId] || 0;
        this.l1BlockTimeSeconds =
            (opts === null || opts === void 0 ? void 0 : opts.l1BlockTimeSeconds) !== undefined
                ? (0, utils_1.toNumber)(opts.l1BlockTimeSeconds)
                : utils_1.CHAIN_BLOCK_TIMES[this.l1ChainId] || 1;
        this.contracts = (0, utils_1.getAllOEContracts)(this.l2ChainId, {
            l1SignerOrProvider: this.l1SignerOrProvider,
            l2SignerOrProvider: this.l2SignerOrProvider,
            overrides: opts.contracts,
        });
        this.bridges = (0, utils_1.getBridgeAdapters)(this.l2ChainId, this, {
            overrides: opts.bridges,
            contracts: opts.contracts,
        });
    }
    Object.defineProperty(CrossChainMessenger.prototype, "l1Provider", {
        /**
         * Provider connected to the L1 chain.
         */
        get: function () {
            if (abstract_provider_1.Provider.isProvider(this.l1SignerOrProvider)) {
                return this.l1SignerOrProvider;
            }
            else {
                return this.l1SignerOrProvider.provider;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CrossChainMessenger.prototype, "l2Provider", {
        /**
         * Provider connected to the L2 chain.
         */
        get: function () {
            if (abstract_provider_1.Provider.isProvider(this.l2SignerOrProvider)) {
                return this.l2SignerOrProvider;
            }
            else {
                return this.l2SignerOrProvider.provider;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CrossChainMessenger.prototype, "l1Signer", {
        /**
         * Signer connected to the L1 chain.
         */
        get: function () {
            if (abstract_provider_1.Provider.isProvider(this.l1SignerOrProvider)) {
                throw new Error("messenger has no L1 signer");
            }
            else {
                return this.l1SignerOrProvider;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CrossChainMessenger.prototype, "l2Signer", {
        /**
         * Signer connected to the L2 chain.
         */
        get: function () {
            if (abstract_provider_1.Provider.isProvider(this.l2SignerOrProvider)) {
                throw new Error("messenger has no L2 signer");
            }
            else {
                return this.l2SignerOrProvider;
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Retrieves all cross chain messages sent within a given transaction.
     *
     * @param transaction Transaction hash or receipt to find messages from.
     * @param opts Options object.
     * @param opts.direction Direction to search for messages in. If not provided, will attempt to
     * automatically search both directions under the assumption that a transaction hash will only
     * exist on one chain. If the hash exists on both chains, will throw an error.
     * @returns All cross chain messages sent within the transaction.
     */
    CrossChainMessenger.prototype.getMessagesByTransaction = function (transaction, opts) {
        var _a, _b;
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var txHash, receipt, messenger;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Wait for the transaction receipt if the input is waitable.
                    return [4 /*yield*/, ((_b = (_a = transaction).wait) === null || _b === void 0 ? void 0 : _b.call(_a))
                        // Convert the input to a transaction hash.
                    ];
                    case 1:
                        // Wait for the transaction receipt if the input is waitable.
                        _c.sent();
                        txHash = (0, utils_1.toTransactionHash)(transaction);
                        if (!(opts.direction !== undefined)) return [3 /*break*/, 6];
                        if (!(opts.direction === interfaces_1.MessageDirection.L1_TO_L2)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.l1Provider.getTransactionReceipt(txHash)];
                    case 2:
                        receipt = _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.l2Provider.getTransactionReceipt(txHash)];
                    case 4:
                        receipt = _c.sent();
                        _c.label = 5;
                    case 5: return [3 /*break*/, 10];
                    case 6: return [4 /*yield*/, this.l1Provider.getTransactionReceipt(txHash)];
                    case 7:
                        // Try both directions, starting with L1 => L2.
                        receipt = _c.sent();
                        if (!receipt) return [3 /*break*/, 8];
                        opts.direction = interfaces_1.MessageDirection.L1_TO_L2;
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.l2Provider.getTransactionReceipt(txHash)];
                    case 9:
                        receipt = _c.sent();
                        opts.direction = interfaces_1.MessageDirection.L2_TO_L1;
                        _c.label = 10;
                    case 10:
                        if (!receipt) {
                            throw new Error("unable to find transaction receipt for ".concat(txHash));
                        }
                        messenger = opts.direction === interfaces_1.MessageDirection.L1_TO_L2
                            ? this.contracts.l1.L1CrossDomainMessenger
                            : this.contracts.l2.L2CrossDomainMessenger;
                        return [2 /*return*/, receipt.logs
                                .filter(function (log) {
                                // Only look at logs emitted by the messenger address
                                return log.address === messenger.address;
                            })
                                .filter(function (log) {
                                // Only look at SentMessage logs specifically
                                var parsed = messenger.interface.parseLog(log);
                                return parsed.name === 'SentMessage';
                            })
                                .map(function (log) {
                                // Try to pull out the value field, but only if the very next log is a SentMessageExtension1
                                // event which was introduced in the Bedrock upgrade.
                                var value = ethers_1.ethers.BigNumber.from(0);
                                var next = receipt.logs.find(function (l) {
                                    return (l.logIndex === log.logIndex + 1 && l.address === messenger.address);
                                });
                                if (next) {
                                    var nextParsed = messenger.interface.parseLog(next);
                                    if (nextParsed.name === 'SentMessageExtension1') {
                                        value = nextParsed.args.value;
                                    }
                                }
                                // Convert each SentMessage log into a message object
                                var parsed = messenger.interface.parseLog(log);
                                return {
                                    direction: opts.direction,
                                    target: parsed.args.target,
                                    sender: parsed.args.sender,
                                    message: parsed.args.message,
                                    messageNonce: parsed.args.messageNonce,
                                    value: value,
                                    minGasLimit: parsed.args.gasLimit,
                                    logIndex: log.logIndex,
                                    blockNumber: log.blockNumber,
                                    transactionHash: log.transactionHash,
                                };
                            })];
                }
            });
        });
    };
    /**
     * Transforms a legacy message into its corresponding Bedrock representation.
     *
     * @param message Legacy message to transform.
     * @returns Bedrock representation of the message.
     */
    CrossChainMessenger.prototype.toBedrockCrossChainMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, version, value;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)
                        // Bedrock messages are already in the correct format.
                    ];
                    case 1:
                        resolved = _b.sent();
                        version = (0, core_utils_1.decodeVersionedNonce)(resolved.messageNonce).version;
                        if (version.eq(1)) {
                            return [2 /*return*/, resolved];
                        }
                        value = ethers_1.BigNumber.from(0);
                        if (resolved.direction === interfaces_1.MessageDirection.L2_TO_L1 &&
                            resolved.sender === this.contracts.l2.L2StandardBridge.address &&
                            resolved.target === this.contracts.l1.L1StandardBridge.address) {
                            try {
                                ;
                                _a = this.contracts.l1.L1StandardBridge.interface.decodeFunctionData('finalizeETHWithdrawal', resolved.message), value = _a[2];
                            }
                            catch (err) {
                                // No problem, not a message with value.
                            }
                        }
                        return [2 /*return*/, __assign(__assign({}, resolved), { value: value, minGasLimit: ethers_1.BigNumber.from(0), messageNonce: (0, core_utils_1.encodeVersionedNonce)(ethers_1.BigNumber.from(1), resolved.messageNonce) })];
                }
            });
        });
    };
    /**
     * Transforms a CrossChainMessenger message into its low-level representation inside the
     * L2ToL1MessagePasser contract on L2.
     *
     * @param message Message to transform.
     * @return Transformed message.
     */
    CrossChainMessenger.prototype.toLowLevelMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, version, updated, gasLimit, messageNonce, receipt, withdrawals, _i, _a, log, decoded, withdrawal;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                    case 1:
                        resolved = _b.sent();
                        if (resolved.direction === interfaces_1.MessageDirection.L1_TO_L2) {
                            throw new Error("can only convert L2 to L1 messages to low level");
                        }
                        version = (0, core_utils_1.decodeVersionedNonce)(resolved.messageNonce).version;
                        if (!version.eq(0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.toBedrockCrossChainMessage(resolved)];
                    case 2:
                        updated = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        updated = resolved;
                        _b.label = 4;
                    case 4:
                        if (!version.eq(0)) return [3 /*break*/, 5];
                        gasLimit = ethers_1.BigNumber.from(0);
                        messageNonce = resolved.messageNonce;
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.l2Provider.getTransactionReceipt(resolved.transactionHash)];
                    case 6:
                        receipt = _b.sent();
                        withdrawals = [];
                        for (_i = 0, _a = receipt.logs; _i < _a.length; _i++) {
                            log = _a[_i];
                            if (log.address === this.contracts.l2.BedrockMessagePasser.address) {
                                decoded = this.contracts.l2.L2ToL1MessagePasser.interface.parseLog(log);
                                if (decoded.name === 'MessagePassed') {
                                    withdrawals.push(decoded.args);
                                }
                            }
                        }
                        // Should not happen.
                        if (withdrawals.length === 0) {
                            throw new Error("no withdrawals found in receipt");
                        }
                        // TODO: Add support for multiple withdrawals.
                        if (withdrawals.length > 1) {
                            throw new Error("multiple withdrawals found in receipt");
                        }
                        withdrawal = withdrawals[0];
                        messageNonce = withdrawal.nonce;
                        gasLimit = withdrawal.gasLimit;
                        _b.label = 7;
                    case 7: return [2 /*return*/, {
                            messageNonce: messageNonce,
                            sender: this.contracts.l2.L2CrossDomainMessenger.address,
                            target: this.contracts.l1.L1CrossDomainMessenger.address,
                            value: updated.value,
                            minGasLimit: gasLimit,
                            message: (0, core_utils_1.encodeCrossDomainMessageV1)(updated.messageNonce, updated.sender, updated.target, updated.value, updated.minGasLimit, updated.message),
                        }];
                }
            });
        });
    };
    // public async getMessagesByAddress(
    //   address: AddressLike,
    //   opts?: {
    //     direction?: MessageDirection
    //     fromBlock?: NumberLike
    //     toBlock?: NumberLike
    //   }
    // ): Promise<CrossChainMessage[]> {
    //   throw new Error(`
    //     The function getMessagesByAddress is currently not enabled because the sender parameter of
    //     the SentMessage event is not indexed within the CrossChainMessenger contracts.
    //     getMessagesByAddress will be enabled by plugging in an Optimism Indexer (coming soon).
    //     See the following issue on GitHub for additional context:
    //     https://github.com/ethereum-optimism/optimism/issues/2129
    //   `)
    // }
    /**
     * Finds the appropriate bridge adapter for a given L1<>L2 token pair. Will throw if no bridges
     * support the token pair or if more than one bridge supports the token pair.
     *
     * @param l1Token L1 token address.
     * @param l2Token L2 token address.
     * @returns The appropriate bridge adapter for the given token pair.
     */
    CrossChainMessenger.prototype.getBridgeForTokenPair = function (l1Token, l2Token) {
        return __awaiter(this, void 0, void 0, function () {
            var bridges, _i, _a, bridge;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        bridges = [];
                        _i = 0, _a = Object.values(this.bridges);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        bridge = _a[_i];
                        return [4 /*yield*/, bridge.supportsTokenPair(l1Token, l2Token)];
                    case 2:
                        if (_b.sent()) {
                            bridges.push(bridge);
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (bridges.length === 0) {
                            throw new Error("no supported bridge for token pair");
                        }
                        if (bridges.length > 1) {
                            throw new Error("found more than one bridge for token pair");
                        }
                        return [2 /*return*/, bridges[0]];
                }
            });
        });
    };
    /**
     * Gets all deposits for a given address.
     *
     * @param address Address to search for messages from.
     * @param opts Options object.
     * @param opts.fromBlock Block to start searching for messages from. If not provided, will start
     * from the first block (block #0).
     * @param opts.toBlock Block to stop searching for messages at. If not provided, will stop at the
     * latest known block ("latest").
     * @returns All deposit token bridge messages sent by the given address.
     */
    CrossChainMessenger.prototype.getDepositsByAddress = function (address, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(Object.values(this.bridges).map(function (bridge) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, bridge.getDepositsByAddress(address, opts)];
                            });
                        }); }))];
                    case 1: return [2 /*return*/, (_a.sent())
                            .reduce(function (acc, val) {
                            return acc.concat(val);
                        }, [])
                            .sort(function (a, b) {
                            // Sort descending by block number
                            return b.blockNumber - a.blockNumber;
                        })];
                }
            });
        });
    };
    /**
     * Gets all withdrawals for a given address.
     *
     * @param address Address to search for messages from.
     * @param opts Options object.
     * @param opts.fromBlock Block to start searching for messages from. If not provided, will start
     * from the first block (block #0).
     * @param opts.toBlock Block to stop searching for messages at. If not provided, will stop at the
     * latest known block ("latest").
     * @returns All withdrawal token bridge messages sent by the given address.
     */
    CrossChainMessenger.prototype.getWithdrawalsByAddress = function (address, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(Object.values(this.bridges).map(function (bridge) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, bridge.getWithdrawalsByAddress(address, opts)];
                            });
                        }); }))];
                    case 1: return [2 /*return*/, (_a.sent())
                            .reduce(function (acc, val) {
                            return acc.concat(val);
                        }, [])
                            .sort(function (a, b) {
                            // Sort descending by block number
                            return b.blockNumber - a.blockNumber;
                        })];
                }
            });
        });
    };
    /**
     * Resolves a MessageLike into a CrossChainMessage object.
     * Unlike other coercion functions, this function is stateful and requires making additional
     * requests. For now I'm going to keep this function here, but we could consider putting a
     * similar function inside of utils/coercion.ts if people want to use this without having to
     * create an entire CrossChainProvider object.
     *
     * @param message MessageLike to resolve into a CrossChainMessage.
     * @returns Message coerced into a CrossChainMessage.
     */
    CrossChainMessenger.prototype.toCrossChainMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var messages, found, messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!message.message) return [3 /*break*/, 1];
                        return [2 /*return*/, message];
                    case 1:
                        if (!(message.l1Token &&
                            message.l2Token &&
                            message.transactionHash)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getMessagesByTransaction(message.transactionHash)
                            // The `messages` object corresponds to a list of SentMessage events that were triggered by
                            // the same transaction. We want to find the specific SentMessage event that corresponds to
                            // the TokenBridgeMessage (either a ETHDepositInitiated, ERC20DepositInitiated, or
                            // WithdrawalInitiated event). We expect the behavior of bridge contracts to be that these
                            // TokenBridgeMessage events are triggered and then a SentMessage event is triggered. Our
                            // goal here is therefore to find the first SentMessage event that comes after the input
                            // event.
                        ];
                    case 2:
                        messages = _a.sent();
                        found = messages
                            .sort(function (a, b) {
                            // Sort all messages in ascending order by log index.
                            return a.logIndex - b.logIndex;
                        })
                            .find(function (m) {
                            return m.logIndex > message.logIndex;
                        });
                        if (!found) {
                            throw new Error("could not find SentMessage event for message");
                        }
                        return [2 /*return*/, found];
                    case 3: return [4 /*yield*/, this.getMessagesByTransaction(message)
                        // We only want to treat TransactionLike objects as MessageLike if they only emit a single
                        // message (very common). It's unintuitive to treat a TransactionLike as a MessageLike if
                        // they emit more than one message (which message do you pick?), so we throw an error.
                    ];
                    case 4:
                        messages = _a.sent();
                        // We only want to treat TransactionLike objects as MessageLike if they only emit a single
                        // message (very common). It's unintuitive to treat a TransactionLike as a MessageLike if
                        // they emit more than one message (which message do you pick?), so we throw an error.
                        if (messages.length !== 1) {
                            throw new Error("expected 1 message, got ".concat(messages.length));
                        }
                        return [2 /*return*/, messages[0]];
                }
            });
        });
    };
    /**
     * Retrieves the status of a particular message as an enum.
     *
     * @param message Cross chain message to check the status of.
     * @returns Status of the message.
     */
    CrossChainMessenger.prototype.getMessageStatus = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, receipt, timestamp, output, withdrawal, provenWithdrawal, stateRoot, bn, block, challengePeriod, latestBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                    case 1:
                        resolved = _a.sent();
                        return [4 /*yield*/, this.getMessageReceipt(resolved)];
                    case 2:
                        receipt = _a.sent();
                        if (!(resolved.direction === interfaces_1.MessageDirection.L1_TO_L2)) return [3 /*break*/, 3];
                        if (receipt === null) {
                            return [2 /*return*/, interfaces_1.MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE];
                        }
                        else {
                            if (receipt.receiptStatus === interfaces_1.MessageReceiptStatus.RELAYED_SUCCEEDED) {
                                return [2 /*return*/, interfaces_1.MessageStatus.RELAYED];
                            }
                            else {
                                return [2 /*return*/, interfaces_1.MessageStatus.FAILED_L1_TO_L2_MESSAGE];
                            }
                        }
                        return [3 /*break*/, 14];
                    case 3:
                        if (!(receipt === null)) return [3 /*break*/, 13];
                        timestamp = void 0;
                        if (!this.bedrock) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.getMessageBedrockOutput(resolved)];
                    case 4:
                        output = _a.sent();
                        if (output === null) {
                            return [2 /*return*/, interfaces_1.MessageStatus.STATE_ROOT_NOT_PUBLISHED];
                        }
                        return [4 /*yield*/, this.toLowLevelMessage(resolved)
                            // Attempt to fetch the proven withdrawal.
                        ];
                    case 5:
                        withdrawal = _a.sent();
                        return [4 /*yield*/, this.contracts.l1.OptimismPortal.provenWithdrawals((0, utils_1.hashLowLevelMessage)(withdrawal))
                            // If the withdrawal hash has not been proven on L1,
                            // return `READY_TO_PROVE`
                        ];
                    case 6:
                        provenWithdrawal = _a.sent();
                        // If the withdrawal hash has not been proven on L1,
                        // return `READY_TO_PROVE`
                        if (provenWithdrawal.timestamp.eq(ethers_1.BigNumber.from(0))) {
                            return [2 /*return*/, interfaces_1.MessageStatus.READY_TO_PROVE];
                        }
                        // Set the timestamp to the provenWithdrawal's timestamp
                        timestamp = provenWithdrawal.timestamp.toNumber();
                        return [3 /*break*/, 10];
                    case 7: return [4 /*yield*/, this.getMessageStateRoot(resolved)];
                    case 8:
                        stateRoot = _a.sent();
                        if (stateRoot === null) {
                            return [2 /*return*/, interfaces_1.MessageStatus.STATE_ROOT_NOT_PUBLISHED];
                        }
                        bn = stateRoot.batch.blockNumber;
                        return [4 /*yield*/, this.l1Provider.getBlock(bn)];
                    case 9:
                        block = _a.sent();
                        timestamp = block.timestamp;
                        _a.label = 10;
                    case 10: return [4 /*yield*/, this.getChallengePeriodSeconds()];
                    case 11:
                        challengePeriod = _a.sent();
                        return [4 /*yield*/, this.l1Provider.getBlock('latest')];
                    case 12:
                        latestBlock = _a.sent();
                        if (timestamp + challengePeriod > latestBlock.timestamp) {
                            return [2 /*return*/, interfaces_1.MessageStatus.IN_CHALLENGE_PERIOD];
                        }
                        else {
                            return [2 /*return*/, interfaces_1.MessageStatus.READY_FOR_RELAY];
                        }
                        return [3 /*break*/, 14];
                    case 13:
                        if (receipt.receiptStatus === interfaces_1.MessageReceiptStatus.RELAYED_SUCCEEDED) {
                            return [2 /*return*/, interfaces_1.MessageStatus.RELAYED];
                        }
                        else {
                            return [2 /*return*/, interfaces_1.MessageStatus.READY_FOR_RELAY];
                        }
                        _a.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finds the receipt of the transaction that executed a particular cross chain message.
     *
     * @param message Message to find the receipt of.
     * @returns CrossChainMessage receipt including receipt of the transaction that relayed the
     * given message.
     */
    CrossChainMessenger.prototype.getMessageReceipt = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, messageHash, messenger, relayedMessageEvents, failedRelayedMessageEvents;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                    case 1:
                        resolved = _c.sent();
                        messageHash = (0, core_utils_1.hashCrossDomainMessage)(resolved.messageNonce, resolved.sender, resolved.target, resolved.value, resolved.minGasLimit, resolved.message);
                        messenger = resolved.direction === interfaces_1.MessageDirection.L1_TO_L2
                            ? this.contracts.l2.L2CrossDomainMessenger
                            : this.contracts.l1.L1CrossDomainMessenger;
                        return [4 /*yield*/, messenger.queryFilter(messenger.filters.RelayedMessage(messageHash))
                            // Great, we found the message. Convert it into a transaction receipt.
                        ];
                    case 2:
                        relayedMessageEvents = _c.sent();
                        if (!(relayedMessageEvents.length === 1)) return [3 /*break*/, 4];
                        _a = {
                            receiptStatus: interfaces_1.MessageReceiptStatus.RELAYED_SUCCEEDED
                        };
                        return [4 /*yield*/, relayedMessageEvents[0].getTransactionReceipt()];
                    case 3: return [2 /*return*/, (_a.transactionReceipt = _c.sent(),
                            _a)];
                    case 4:
                        if (relayedMessageEvents.length > 1) {
                            // Should never happen!
                            throw new Error("multiple successful relays for message");
                        }
                        _c.label = 5;
                    case 5: return [4 /*yield*/, messenger.queryFilter(messenger.filters.FailedRelayedMessage(messageHash))
                        // A transaction can fail to be relayed multiple times. We'll always return the last
                        // transaction that attempted to relay the message.
                        // TODO: Is this the best way to handle this?
                    ];
                    case 6:
                        failedRelayedMessageEvents = _c.sent();
                        if (!(failedRelayedMessageEvents.length > 0)) return [3 /*break*/, 8];
                        _b = {
                            receiptStatus: interfaces_1.MessageReceiptStatus.RELAYED_FAILED
                        };
                        return [4 /*yield*/, failedRelayedMessageEvents[failedRelayedMessageEvents.length - 1].getTransactionReceipt()];
                    case 7: return [2 /*return*/, (_b.transactionReceipt = _c.sent(),
                            _b)];
                    case 8: 
                    // TODO: If the user doesn't provide enough gas then there's a chance that FailedRelayedMessage
                    // will never be triggered. We should probably fix this at the contract level by requiring a
                    // minimum amount of input gas and designing the contracts such that the gas will always be
                    // enough to trigger the event. However, for now we need a temporary way to find L1 => L2
                    // transactions that fail but don't alert us because they didn't provide enough gas.
                    // TODO: Talk with the systems and protocol team about coordinating a hard fork that fixes this
                    // on both L1 and L2.
                    // Just return null if we didn't find a receipt. Slightly nicer than throwing an error.
                    return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Waits for a message to be executed and returns the receipt of the transaction that executed
     * the given message.
     *
     * @param message Message to wait for.
     * @param opts Options to pass to the waiting function.
     * @param opts.confirmations Number of transaction confirmations to wait for before returning.
     * @param opts.pollIntervalMs Number of milliseconds to wait between polling for the receipt.
     * @param opts.timeoutMs Milliseconds to wait before timing out.
     * @returns CrossChainMessage receipt including receipt of the transaction that relayed the
     * given message.
     */
    CrossChainMessenger.prototype.waitForMessageReceipt = function (message, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var resolved, totalTimeMs, tick, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                    case 1:
                        resolved = _a.sent();
                        totalTimeMs = 0;
                        _a.label = 2;
                    case 2:
                        if (!(totalTimeMs < (opts.timeoutMs || Infinity))) return [3 /*break*/, 7];
                        tick = Date.now();
                        return [4 /*yield*/, this.getMessageReceipt(resolved)];
                    case 3:
                        receipt = _a.sent();
                        if (!(receipt !== null)) return [3 /*break*/, 4];
                        return [2 /*return*/, receipt];
                    case 4: return [4 /*yield*/, (0, core_utils_1.sleep)(opts.pollIntervalMs || 4000)];
                    case 5:
                        _a.sent();
                        totalTimeMs += Date.now() - tick;
                        _a.label = 6;
                    case 6: return [3 /*break*/, 2];
                    case 7: throw new Error("timed out waiting for message receipt");
                }
            });
        });
    };
    /**
     * Waits until the status of a given message changes to the expected status. Note that if the
     * status of the given message changes to a status that implies the expected status, this will
     * still return. If the status of the message changes to a status that exclues the expected
     * status, this will throw an error.
     *
     * @param message Message to wait for.
     * @param status Expected status of the message.
     * @param opts Options to pass to the waiting function.
     * @param opts.pollIntervalMs Number of milliseconds to wait when polling.
     * @param opts.timeoutMs Milliseconds to wait before timing out.
     */
    CrossChainMessenger.prototype.waitForMessageStatus = function (message, status, opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var resolved, totalTimeMs, tick, currentStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                    case 1:
                        resolved = _a.sent();
                        totalTimeMs = 0;
                        _a.label = 2;
                    case 2:
                        if (!(totalTimeMs < (opts.timeoutMs || Infinity))) return [3 /*break*/, 5];
                        tick = Date.now();
                        return [4 /*yield*/, this.getMessageStatus(resolved)
                            // Handle special cases for L1 to L2 messages.
                        ];
                    case 3:
                        currentStatus = _a.sent();
                        // Handle special cases for L1 to L2 messages.
                        if (resolved.direction === interfaces_1.MessageDirection.L1_TO_L2) {
                            // If we're at the expected status, we're done.
                            if (currentStatus === status) {
                                return [2 /*return*/];
                            }
                            if (status === interfaces_1.MessageStatus.UNCONFIRMED_L1_TO_L2_MESSAGE &&
                                currentStatus > status) {
                                // Anything other than UNCONFIRMED_L1_TO_L2_MESSAGE implies that the message was at one
                                // point "unconfirmed", so we can stop waiting.
                                return [2 /*return*/];
                            }
                            if (status === interfaces_1.MessageStatus.FAILED_L1_TO_L2_MESSAGE &&
                                currentStatus === interfaces_1.MessageStatus.RELAYED) {
                                throw new Error("incompatible message status, expected FAILED_L1_TO_L2_MESSAGE got RELAYED");
                            }
                            if (status === interfaces_1.MessageStatus.RELAYED &&
                                currentStatus === interfaces_1.MessageStatus.FAILED_L1_TO_L2_MESSAGE) {
                                throw new Error("incompatible message status, expected RELAYED got FAILED_L1_TO_L2_MESSAGE");
                            }
                        }
                        // Handle special cases for L2 to L1 messages.
                        if (resolved.direction === interfaces_1.MessageDirection.L2_TO_L1) {
                            if (currentStatus >= status) {
                                // For L2 to L1 messages, anything after the expected status implies the previous status,
                                // so we can safely return if the current status enum is larger than the expected one.
                                return [2 /*return*/];
                            }
                        }
                        return [4 /*yield*/, (0, core_utils_1.sleep)(opts.pollIntervalMs || 4000)];
                    case 4:
                        _a.sent();
                        totalTimeMs += Date.now() - tick;
                        return [3 /*break*/, 2];
                    case 5: throw new Error("timed out waiting for message status change");
                }
            });
        });
    };
    /**
     * Estimates the amount of gas required to fully execute a given message on L2. Only applies to
     * L1 => L2 messages. You would supply this gas limit when sending the message to L2.
     *
     * @param message Message get a gas estimate for.
     * @param opts Options object.
     * @param opts.bufferPercent Percentage of gas to add to the estimate. Defaults to 20.
     * @param opts.from Address to use as the sender.
     * @returns Estimates L2 gas limit.
     */
    CrossChainMessenger.prototype.estimateL2MessageGasLimit = function (message, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, from, estimate, bufferPercent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(message.messageNonce === undefined)) return [3 /*break*/, 1];
                        resolved = message;
                        from = opts === null || opts === void 0 ? void 0 : opts.from;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.toCrossChainMessage(message)];
                    case 2:
                        resolved = _a.sent();
                        from = (opts === null || opts === void 0 ? void 0 : opts.from) || resolved.sender;
                        _a.label = 3;
                    case 3:
                        // L2 message gas estimation is only used for L1 => L2 messages.
                        if (resolved.direction === interfaces_1.MessageDirection.L2_TO_L1) {
                            throw new Error("cannot estimate gas limit for L2 => L1 message");
                        }
                        return [4 /*yield*/, this.l2Provider.estimateGas({
                                from: from,
                                to: resolved.target,
                                data: resolved.message,
                            })
                            // Return the estimate plus a buffer of 20% just in case.
                        ];
                    case 4:
                        estimate = _a.sent();
                        bufferPercent = (opts === null || opts === void 0 ? void 0 : opts.bufferPercent) || 20;
                        return [2 /*return*/, estimate.mul(100 + bufferPercent).div(100)];
                }
            });
        });
    };
    /**
     * Returns the estimated amount of time before the message can be executed. When this is a
     * message being sent to L1, this will return the estimated time until the message will complete
     * its challenge period. When this is a message being sent to L2, this will return the estimated
     * amount of time until the message will be picked up and executed on L2.
     *
     * @param message Message to estimate the time remaining for.
     * @returns Estimated amount of time remaining (in seconds) before the message can be executed.
     */
    CrossChainMessenger.prototype.estimateMessageWaitTimeSeconds = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, status, receipt, blocksLeft, stateRoot, challengePeriod, targetBlock, latestBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                    case 1:
                        resolved = _a.sent();
                        return [4 /*yield*/, this.getMessageStatus(resolved)];
                    case 2:
                        status = _a.sent();
                        if (!(resolved.direction === interfaces_1.MessageDirection.L1_TO_L2)) return [3 /*break*/, 6];
                        if (!(status === interfaces_1.MessageStatus.RELAYED ||
                            status === interfaces_1.MessageStatus.FAILED_L1_TO_L2_MESSAGE)) return [3 /*break*/, 3];
                        // Transactions that are relayed or failed are considered completed, so the wait time is 0.
                        return [2 /*return*/, 0];
                    case 3: return [4 /*yield*/, this.l1Provider.getTransactionReceipt(resolved.transactionHash)];
                    case 4:
                        receipt = _a.sent();
                        blocksLeft = Math.max(this.depositConfirmationBlocks - receipt.confirmations, 0);
                        return [2 /*return*/, blocksLeft * this.l1BlockTimeSeconds];
                    case 5: return [3 /*break*/, 14];
                    case 6:
                        if (!(status === interfaces_1.MessageStatus.RELAYED ||
                            status === interfaces_1.MessageStatus.READY_FOR_RELAY)) return [3 /*break*/, 7];
                        // Transactions that are relayed or ready for relay are considered complete.
                        return [2 /*return*/, 0];
                    case 7:
                        if (!(status === interfaces_1.MessageStatus.STATE_ROOT_NOT_PUBLISHED)) return [3 /*break*/, 8];
                        // If the state root hasn't been published yet, just assume it'll be published relatively
                        // quickly and return the challenge period for now. In the future we could use more
                        // advanced techniques to figure out average time between transaction execution and
                        // state root publication.
                        return [2 /*return*/, this.getChallengePeriodSeconds()];
                    case 8:
                        if (!(status === interfaces_1.MessageStatus.IN_CHALLENGE_PERIOD)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.getMessageStateRoot(resolved)];
                    case 9:
                        stateRoot = _a.sent();
                        return [4 /*yield*/, this.getChallengePeriodSeconds()];
                    case 10:
                        challengePeriod = _a.sent();
                        return [4 /*yield*/, this.l1Provider.getBlock(stateRoot.batch.blockNumber)];
                    case 11:
                        targetBlock = _a.sent();
                        return [4 /*yield*/, this.l1Provider.getBlock('latest')];
                    case 12:
                        latestBlock = _a.sent();
                        return [2 /*return*/, Math.max(challengePeriod - (latestBlock.timestamp - targetBlock.timestamp), 0)];
                    case 13: 
                    // Should not happen
                    throw new Error("unexpected message status");
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Queries the current challenge period in seconds from the StateCommitmentChain.
     *
     * @returns Current challenge period in seconds.
     */
    CrossChainMessenger.prototype.getChallengePeriodSeconds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var challengePeriod, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.bedrock) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.contracts.l1.OptimismPortal.FINALIZATION_PERIOD_SECONDS()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.contracts.l1.StateCommitmentChain.FRAUD_PROOF_WINDOW()];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        challengePeriod = _a;
                        return [2 /*return*/, challengePeriod.toNumber()];
                }
            });
        });
    };
    /**
     * Queries the OptimismPortal contract's `provenWithdrawals` mapping
     * for a ProvenWithdrawal that matches the passed withdrawalHash
     *
     * Note: This function is bedrock-specific.
     *
     * @returns A ProvenWithdrawal object
     */
    CrossChainMessenger.prototype.getProvenWithdrawal = function (withdrawalHash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.bedrock) {
                    throw new Error('message proving only applies after the bedrock upgrade');
                }
                return [2 /*return*/, this.contracts.l1.OptimismPortal.provenWithdrawals(withdrawalHash)];
            });
        });
    };
    /**
     * Returns the Bedrock output root that corresponds to the given message.
     *
     * @param message Message to get the Bedrock output root for.
     * @returns Bedrock output root.
     */
    CrossChainMessenger.prototype.getMessageBedrockOutput = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, l2OutputIndex, err_1, proposal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)
                        // Outputs are only a thing for L2 to L1 messages.
                    ];
                    case 1:
                        resolved = _a.sent();
                        // Outputs are only a thing for L2 to L1 messages.
                        if (resolved.direction === interfaces_1.MessageDirection.L1_TO_L2) {
                            throw new Error("cannot get a state root for an L1 to L2 message");
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.contracts.l1.L2OutputOracle.getL2OutputIndexAfter(resolved.blockNumber)];
                    case 3:
                        l2OutputIndex =
                            _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        if (err_1.message.includes('L2OutputOracle: cannot get output')) {
                            return [2 /*return*/, null];
                        }
                        else {
                            throw err_1;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [4 /*yield*/, this.contracts.l1.L2OutputOracle.getL2Output(l2OutputIndex)
                        // Format everything and return it nicely.
                    ];
                    case 6:
                        proposal = _a.sent();
                        // Format everything and return it nicely.
                        return [2 /*return*/, {
                                outputRoot: proposal.outputRoot,
                                l1Timestamp: proposal.timestamp.toNumber(),
                                l2BlockNumber: proposal.l2BlockNumber.toNumber(),
                                l2OutputIndex: l2OutputIndex.toNumber(),
                            }];
                }
            });
        });
    };
    /**
     * Returns the state root that corresponds to a given message. This is the state root for the
     * block in which the transaction was included, as published to the StateCommitmentChain. If the
     * state root for the given message has not been published yet, this function returns null.
     *
     * @param message Message to find a state root for.
     * @returns State root for the block in which the message was created.
     */
    CrossChainMessenger.prototype.getMessageStateRoot = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, messageTxReceipt, messageTxIndex, stateRootBatch, indexInBatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)
                        // State roots are only a thing for L2 to L1 messages.
                    ];
                    case 1:
                        resolved = _a.sent();
                        // State roots are only a thing for L2 to L1 messages.
                        if (resolved.direction === interfaces_1.MessageDirection.L1_TO_L2) {
                            throw new Error("cannot get a state root for an L1 to L2 message");
                        }
                        return [4 /*yield*/, this.l2Provider.getTransactionReceipt(resolved.transactionHash)
                            // Every block has exactly one transaction in it. Since there's a genesis block, the
                            // transaction index will always be one less than the block number.
                        ];
                    case 2:
                        messageTxReceipt = _a.sent();
                        messageTxIndex = messageTxReceipt.blockNumber - 1;
                        return [4 /*yield*/, this.getStateRootBatchByTransactionIndex(messageTxIndex)
                            // No state root batch, no state root.
                        ];
                    case 3:
                        stateRootBatch = _a.sent();
                        // No state root batch, no state root.
                        if (stateRootBatch === null) {
                            return [2 /*return*/, null];
                        }
                        indexInBatch = messageTxIndex - stateRootBatch.header.prevTotalElements.toNumber();
                        // Just a sanity check.
                        if (stateRootBatch.stateRoots.length <= indexInBatch) {
                            // Should never happen!
                            throw new Error("state root does not exist in batch");
                        }
                        return [2 /*return*/, {
                                stateRoot: stateRootBatch.stateRoots[indexInBatch],
                                stateRootIndexInBatch: indexInBatch,
                                batch: stateRootBatch,
                            }];
                }
            });
        });
    };
    /**
     * Returns the StateBatchAppended event that was emitted when the batch with a given index was
     * created. Returns null if no such event exists (the batch has not been submitted).
     *
     * @param batchIndex Index of the batch to find an event for.
     * @returns StateBatchAppended event for the batch, or null if no such batch exists.
     */
    CrossChainMessenger.prototype.getStateBatchAppendedEventByBatchIndex = function (batchIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contracts.l1.StateCommitmentChain.queryFilter(this.contracts.l1.StateCommitmentChain.filters.StateBatchAppended(batchIndex))];
                    case 1:
                        events = _a.sent();
                        if (events.length === 0) {
                            return [2 /*return*/, null];
                        }
                        else if (events.length > 1) {
                            // Should never happen!
                            throw new Error("found more than one StateBatchAppended event");
                        }
                        else {
                            return [2 /*return*/, events[0]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the StateBatchAppended event for the batch that includes the transaction with the
     * given index. Returns null if no such event exists.
     *
     * @param transactionIndex Index of the L2 transaction to find an event for.
     * @returns StateBatchAppended event for the batch that includes the given transaction by index.
     */
    CrossChainMessenger.prototype.getStateBatchAppendedEventByTransactionIndex = function (transactionIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var isEventHi, isEventLo, totalBatches, lowerBound, upperBound, batchEvent, middleOfBounds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isEventHi = function (event, index) {
                            var prevTotalElements = event.args._prevTotalElements.toNumber();
                            return index < prevTotalElements;
                        };
                        isEventLo = function (event, index) {
                            var prevTotalElements = event.args._prevTotalElements.toNumber();
                            var batchSize = event.args._batchSize.toNumber();
                            return index >= prevTotalElements + batchSize;
                        };
                        return [4 /*yield*/, this.contracts.l1.StateCommitmentChain.getTotalBatches()];
                    case 1:
                        totalBatches = _a.sent();
                        if (totalBatches.eq(0)) {
                            return [2 /*return*/, null];
                        }
                        lowerBound = 0;
                        upperBound = totalBatches.toNumber() - 1;
                        return [4 /*yield*/, this.getStateBatchAppendedEventByBatchIndex(upperBound)
                            // Only happens when no batches have been submitted yet.
                        ];
                    case 2:
                        batchEvent = _a.sent();
                        // Only happens when no batches have been submitted yet.
                        if (batchEvent === null) {
                            return [2 /*return*/, null];
                        }
                        if (isEventLo(batchEvent, transactionIndex)) {
                            // Upper bound is too low, means this transaction doesn't have a corresponding state batch yet.
                            return [2 /*return*/, null];
                        }
                        else if (!isEventHi(batchEvent, transactionIndex)) {
                            // Upper bound is not too low and also not too high. This means the upper bound event is the
                            // one we're looking for! Return it.
                            return [2 /*return*/, batchEvent];
                        }
                        _a.label = 3;
                    case 3:
                        if (!(lowerBound < upperBound)) return [3 /*break*/, 5];
                        middleOfBounds = Math.floor((lowerBound + upperBound) / 2);
                        return [4 /*yield*/, this.getStateBatchAppendedEventByBatchIndex(middleOfBounds)];
                    case 4:
                        batchEvent = _a.sent();
                        if (isEventHi(batchEvent, transactionIndex)) {
                            upperBound = middleOfBounds;
                        }
                        else if (isEventLo(batchEvent, transactionIndex)) {
                            lowerBound = middleOfBounds;
                        }
                        else {
                            return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 3];
                    case 5: return [2 /*return*/, batchEvent];
                }
            });
        });
    };
    /**
     * Returns information about the state root batch that included the state root for the given
     * transaction by index. Returns null if no such state root has been published yet.
     *
     * @param transactionIndex Index of the L2 transaction to find a state root batch for.
     * @returns State root batch for the given transaction index, or null if none exists yet.
     */
    CrossChainMessenger.prototype.getStateRootBatchByTransactionIndex = function (transactionIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var stateBatchAppendedEvent, stateBatchTransaction, stateRoots;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getStateBatchAppendedEventByTransactionIndex(transactionIndex)];
                    case 1:
                        stateBatchAppendedEvent = _a.sent();
                        if (stateBatchAppendedEvent === null) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, stateBatchAppendedEvent.getTransaction()];
                    case 2:
                        stateBatchTransaction = _a.sent();
                        stateRoots = this.contracts.l1.StateCommitmentChain.interface.decodeFunctionData('appendStateBatch', stateBatchTransaction.data)[0];
                        return [2 /*return*/, {
                                blockNumber: stateBatchAppendedEvent.blockNumber,
                                stateRoots: stateRoots,
                                header: {
                                    batchIndex: stateBatchAppendedEvent.args._batchIndex,
                                    batchRoot: stateBatchAppendedEvent.args._batchRoot,
                                    batchSize: stateBatchAppendedEvent.args._batchSize,
                                    prevTotalElements: stateBatchAppendedEvent.args._prevTotalElements,
                                    extraData: stateBatchAppendedEvent.args._extraData,
                                },
                            }];
                }
            });
        });
    };
    /**
     * Generates the proof required to finalize an L2 to L1 message.
     *
     * @param message Message to generate a proof for.
     * @returns Proof that can be used to finalize the message.
     */
    CrossChainMessenger.prototype.getMessageProof = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, stateRoot, messageSlot, stateTrieProof;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                    case 1:
                        resolved = _a.sent();
                        if (resolved.direction === interfaces_1.MessageDirection.L1_TO_L2) {
                            throw new Error("can only generate proofs for L2 to L1 messages");
                        }
                        return [4 /*yield*/, this.getMessageStateRoot(resolved)];
                    case 2:
                        stateRoot = _a.sent();
                        if (stateRoot === null) {
                            throw new Error("state root for message not yet published");
                        }
                        messageSlot = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.keccak256((0, core_utils_1.encodeCrossDomainMessageV0)(resolved.target, resolved.sender, resolved.message, resolved.messageNonce) + (0, core_utils_1.remove0x)(this.contracts.l2.L2CrossDomainMessenger.address)) + '00'.repeat(32));
                        return [4 /*yield*/, (0, utils_1.makeStateTrieProof)(this.l2Provider, resolved.blockNumber, this.contracts.l2.OVM_L2ToL1MessagePasser.address, messageSlot)];
                    case 3:
                        stateTrieProof = _a.sent();
                        return [2 /*return*/, {
                                stateRoot: stateRoot.stateRoot,
                                stateRootBatchHeader: stateRoot.batch.header,
                                stateRootProof: {
                                    index: stateRoot.stateRootIndexInBatch,
                                    siblings: (0, utils_1.makeMerkleTreeProof)(stateRoot.batch.stateRoots, stateRoot.stateRootIndexInBatch),
                                },
                                stateTrieWitness: (0, core_utils_1.toHexString)(rlp.encode(stateTrieProof.accountProof)),
                                storageTrieWitness: (0, core_utils_1.toHexString)(rlp.encode(stateTrieProof.storageProof)),
                            }];
                }
            });
        });
    };
    /**
     * Generates the bedrock proof required to finalize an L2 to L1 message.
     *
     * @param message Message to generate a proof for.
     * @returns Proof that can be used to finalize the message.
     */
    CrossChainMessenger.prototype.getBedrockMessageProof = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, output, withdrawal, messageSlot, stateTrieProof, block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toCrossChainMessage(message)];
                    case 1:
                        resolved = _a.sent();
                        if (resolved.direction === interfaces_1.MessageDirection.L1_TO_L2) {
                            throw new Error("can only generate proofs for L2 to L1 messages");
                        }
                        return [4 /*yield*/, this.getMessageBedrockOutput(resolved)];
                    case 2:
                        output = _a.sent();
                        if (output === null) {
                            throw new Error("state root for message not yet published");
                        }
                        return [4 /*yield*/, this.toLowLevelMessage(resolved)];
                    case 3:
                        withdrawal = _a.sent();
                        messageSlot = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(['bytes32', 'uint256'], [(0, utils_1.hashLowLevelMessage)(withdrawal), ethers_1.ethers.constants.HashZero]));
                        return [4 /*yield*/, (0, utils_1.makeStateTrieProof)(this.l2Provider, output.l2BlockNumber, this.contracts.l2.BedrockMessagePasser.address, messageSlot)];
                    case 4:
                        stateTrieProof = _a.sent();
                        return [4 /*yield*/, this.l2Provider.send('eth_getBlockByNumber', [
                                (0, core_utils_1.toRpcHexString)(output.l2BlockNumber),
                                false,
                            ])];
                    case 5:
                        block = _a.sent();
                        return [2 /*return*/, {
                                outputRootProof: {
                                    version: ethers_1.ethers.constants.HashZero,
                                    stateRoot: block.stateRoot,
                                    messagePasserStorageRoot: stateTrieProof.storageRoot,
                                    latestBlockhash: block.hash,
                                },
                                withdrawalProof: stateTrieProof.storageProof,
                                l2OutputIndex: output.l2OutputIndex,
                            }];
                }
            });
        });
    };
    /**
     * Sends a given cross chain message. Where the message is sent depends on the direction attached
     * to the message itself.
     *
     * @param message Cross chain message to send.
     * @param opts Additional options.
     * @param opts.signer Optional signer to use to send the transaction.
     * @param opts.l2GasLimit Optional gas limit to use for the transaction on L2.
     * @param opts.overrides Optional transaction overrides.
     * @returns Transaction response for the message sending transaction.
     */
    CrossChainMessenger.prototype.sendMessage = function (message, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.populateTransaction.sendMessage(message, opts)];
                    case 1:
                        tx = _a.sent();
                        if (message.direction === interfaces_1.MessageDirection.L1_TO_L2) {
                            return [2 /*return*/, ((opts === null || opts === void 0 ? void 0 : opts.signer) || this.l1Signer).sendTransaction(tx)];
                        }
                        else {
                            return [2 /*return*/, ((opts === null || opts === void 0 ? void 0 : opts.signer) || this.l2Signer).sendTransaction(tx)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Resends a given cross chain message with a different gas limit. Only applies to L1 to L2
     * messages. If provided an L2 to L1 message, this function will throw an error.
     *
     * @param message Cross chain message to resend.
     * @param messageGasLimit New gas limit to use for the message.
     * @param opts Additional options.
     * @param opts.signer Optional signer to use to send the transaction.
     * @param opts.overrides Optional transaction overrides.
     * @returns Transaction response for the message resending transaction.
     */
    CrossChainMessenger.prototype.resendMessage = function (message, messageGasLimit, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = ((opts === null || opts === void 0 ? void 0 : opts.signer) || this.l1Signer)).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.resendMessage(message, messageGasLimit, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * Proves a cross chain message that was sent from L2 to L1. Only applicable for L2 to L1
     * messages.
     *
     * @param message Message to finalize.
     * @param opts Additional options.
     * @param opts.signer Optional signer to use to send the transaction.
     * @param opts.overrides Optional transaction overrides.
     * @returns Transaction response for the finalization transaction.
     */
    CrossChainMessenger.prototype.proveMessage = function (message, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = ((opts === null || opts === void 0 ? void 0 : opts.signer) || this.l1Signer)).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.proveMessage(message, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * Finalizes a cross chain message that was sent from L2 to L1. Only applicable for L2 to L1
     * messages. Will throw an error if the message has not completed its challenge period yet.
     *
     * @param message Message to finalize.
     * @param opts Additional options.
     * @param opts.signer Optional signer to use to send the transaction.
     * @param opts.overrides Optional transaction overrides.
     * @returns Transaction response for the finalization transaction.
     */
    CrossChainMessenger.prototype.finalizeMessage = function (message, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = ((opts === null || opts === void 0 ? void 0 : opts.signer) || this.l1Signer)).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.finalizeMessage(message, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * Deposits some ETH into the L2 chain.
     *
     * @param amount Amount of ETH to deposit (in wei).
     * @param opts Additional options.
     * @param opts.signer Optional signer to use to send the transaction.
     * @param opts.recipient Optional address to receive the funds on L2. Defaults to sender.
     * @param opts.l2GasLimit Optional gas limit to use for the transaction on L2.
     * @param opts.overrides Optional transaction overrides.
     * @returns Transaction response for the deposit transaction.
     */
    CrossChainMessenger.prototype.depositETH = function (amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = ((opts === null || opts === void 0 ? void 0 : opts.signer) || this.l1Signer)).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.depositETH(amount, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * Withdraws some ETH back to the L1 chain.
     *
     * @param amount Amount of ETH to withdraw.
     * @param opts Additional options.
     * @param opts.signer Optional signer to use to send the transaction.
     * @param opts.recipient Optional address to receive the funds on L1. Defaults to sender.
     * @param opts.overrides Optional transaction overrides.
     * @returns Transaction response for the withdraw transaction.
     */
    CrossChainMessenger.prototype.withdrawETH = function (amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = ((opts === null || opts === void 0 ? void 0 : opts.signer) || this.l2Signer)).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.withdrawETH(amount, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * Queries the account's approval amount for a given L1 token.
     *
     * @param l1Token The L1 token address.
     * @param l2Token The L2 token address.
     * @param opts Additional options.
     * @param opts.signer Optional signer to get the approval for.
     * @returns Amount of tokens approved for deposits from the account.
     */
    CrossChainMessenger.prototype.approval = function (l1Token, l2Token, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var bridge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBridgeForTokenPair(l1Token, l2Token)];
                    case 1:
                        bridge = _a.sent();
                        return [2 /*return*/, bridge.approval(l1Token, l2Token, (opts === null || opts === void 0 ? void 0 : opts.signer) || this.l1Signer)];
                }
            });
        });
    };
    /**
     * Approves a deposit into the L2 chain.
     *
     * @param l1Token The L1 token address.
     * @param l2Token The L2 token address.
     * @param amount Amount of the token to approve.
     * @param opts Additional options.
     * @param opts.signer Optional signer to use to send the transaction.
     * @param opts.overrides Optional transaction overrides.
     * @returns Transaction response for the approval transaction.
     */
    CrossChainMessenger.prototype.approveERC20 = function (l1Token, l2Token, amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = ((opts === null || opts === void 0 ? void 0 : opts.signer) || this.l1Signer)).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.approveERC20(l1Token, l2Token, amount, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * Deposits some ERC20 tokens into the L2 chain.
     *
     * @param l1Token Address of the L1 token.
     * @param l2Token Address of the L2 token.
     * @param amount Amount to deposit.
     * @param opts Additional options.
     * @param opts.signer Optional signer to use to send the transaction.
     * @param opts.recipient Optional address to receive the funds on L2. Defaults to sender.
     * @param opts.l2GasLimit Optional gas limit to use for the transaction on L2.
     * @param opts.overrides Optional transaction overrides.
     * @returns Transaction response for the deposit transaction.
     */
    CrossChainMessenger.prototype.depositERC20 = function (l1Token, l2Token, amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = ((opts === null || opts === void 0 ? void 0 : opts.signer) || this.l1Signer)).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.depositERC20(l1Token, l2Token, amount, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * Withdraws some ERC20 tokens back to the L1 chain.
     *
     * @param l1Token Address of the L1 token.
     * @param l2Token Address of the L2 token.
     * @param amount Amount to withdraw.
     * @param opts Additional options.
     * @param opts.signer Optional signer to use to send the transaction.
     * @param opts.recipient Optional address to receive the funds on L1. Defaults to sender.
     * @param opts.overrides Optional transaction overrides.
     * @returns Transaction response for the withdraw transaction.
     */
    CrossChainMessenger.prototype.withdrawERC20 = function (l1Token, l2Token, amount, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = ((opts === null || opts === void 0 ? void 0 : opts.signer) || this.l2Signer)).sendTransaction;
                        return [4 /*yield*/, this.populateTransaction.withdrawERC20(l1Token, l2Token, amount, opts)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    return CrossChainMessenger;
}());
exports.CrossChainMessenger = CrossChainMessenger;
