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
exports.asL2Provider = exports.isL2Provider = exports.estimateTotalGasCost = exports.estimateL2GasCost = exports.estimateL1GasCost = exports.estimateL1Gas = exports.getL1GasPrice = void 0;
var transactions_1 = require("@ethersproject/transactions");
var ethers_1 = require("ethers");
var contracts_1 = require("@eth-optimism/contracts");
var cloneDeep_1 = require("lodash/cloneDeep");
var utils_1 = require("./utils");
/**
 * Gets a reasonable nonce for the transaction.
 *
 * @param provider Provider to get the nonce from.
 * @param tx Requested transaction.
 * @returns A reasonable nonce for the transaction.
 */
var getNonceForTx = function (provider, tx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (tx.nonce !== undefined) {
            return [2 /*return*/, (0, utils_1.toNumber)(tx.nonce)];
        }
        else if (tx.from !== undefined) {
            return [2 /*return*/, (0, utils_1.toProvider)(provider).getTransactionCount(tx.from)];
        }
        else {
            // Large nonce with lots of non-zero bytes
            return [2 /*return*/, 0xffffffff];
        }
        return [2 /*return*/];
    });
}); };
/**
 * Returns a Contract object for the GasPriceOracle.
 *
 * @param provider Provider to attach the contract to.
 * @returns Contract object for the GasPriceOracle.
 */
var connectGasPriceOracle = function (provider) {
    return new ethers_1.Contract(contracts_1.predeploys.OVM_GasPriceOracle, (0, contracts_1.getContractInterface)('OVM_GasPriceOracle'), (0, utils_1.toProvider)(provider));
};
/**
 * Gets the current L1 gas price as seen on L2.
 *
 * @param l2Provider L2 provider to query the L1 gas price from.
 * @returns Current L1 gas price as seen on L2.
 */
var getL1GasPrice = function (l2Provider) { return __awaiter(void 0, void 0, void 0, function () {
    var gpo;
    return __generator(this, function (_a) {
        gpo = connectGasPriceOracle(l2Provider);
        return [2 /*return*/, gpo.l1BaseFee()];
    });
}); };
exports.getL1GasPrice = getL1GasPrice;
/**
 * Estimates the amount of L1 gas required for a given L2 transaction.
 *
 * @param l2Provider L2 provider to query the gas usage from.
 * @param tx Transaction to estimate L1 gas for.
 * @returns Estimated L1 gas.
 */
var estimateL1Gas = function (l2Provider, tx) { return __awaiter(void 0, void 0, void 0, function () {
    var gpo, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                gpo = connectGasPriceOracle(l2Provider);
                _b = (_a = gpo).getL1GasUsed;
                _c = transactions_1.serialize;
                _d = {
                    data: tx.data,
                    to: tx.to,
                    gasPrice: tx.gasPrice,
                    type: tx.type,
                    gasLimit: tx.gasLimit
                };
                return [4 /*yield*/, getNonceForTx(l2Provider, tx)];
            case 1: return [2 /*return*/, _b.apply(_a, [_c.apply(void 0, [(_d.nonce = _e.sent(),
                            _d)])])];
        }
    });
}); };
exports.estimateL1Gas = estimateL1Gas;
/**
 * Estimates the amount of L1 gas cost for a given L2 transaction in wei.
 *
 * @param l2Provider L2 provider to query the gas usage from.
 * @param tx Transaction to estimate L1 gas cost for.
 * @returns Estimated L1 gas cost.
 */
var estimateL1GasCost = function (l2Provider, tx) { return __awaiter(void 0, void 0, void 0, function () {
    var gpo, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                gpo = connectGasPriceOracle(l2Provider);
                _b = (_a = gpo).getL1Fee;
                _c = transactions_1.serialize;
                _d = {
                    data: tx.data,
                    to: tx.to,
                    gasPrice: tx.gasPrice,
                    type: tx.type,
                    gasLimit: tx.gasLimit
                };
                return [4 /*yield*/, getNonceForTx(l2Provider, tx)];
            case 1: return [2 /*return*/, _b.apply(_a, [_c.apply(void 0, [(_d.nonce = _e.sent(),
                            _d)])])];
        }
    });
}); };
exports.estimateL1GasCost = estimateL1GasCost;
/**
 * Estimates the L2 gas cost for a given L2 transaction in wei.
 *
 * @param l2Provider L2 provider to query the gas usage from.
 * @param tx Transaction to estimate L2 gas cost for.
 * @returns Estimated L2 gas cost.
 */
var estimateL2GasCost = function (l2Provider, tx) { return __awaiter(void 0, void 0, void 0, function () {
    var parsed, l2GasPrice, l2GasCost;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                parsed = (0, utils_1.toProvider)(l2Provider);
                return [4 /*yield*/, parsed.getGasPrice()];
            case 1:
                l2GasPrice = _a.sent();
                return [4 /*yield*/, parsed.estimateGas(tx)];
            case 2:
                l2GasCost = _a.sent();
                return [2 /*return*/, l2GasPrice.mul(l2GasCost)];
        }
    });
}); };
exports.estimateL2GasCost = estimateL2GasCost;
/**
 * Estimates the total gas cost for a given L2 transaction in wei.
 *
 * @param l2Provider L2 provider to query the gas usage from.
 * @param tx Transaction to estimate total gas cost for.
 * @returns Estimated total gas cost.
 */
var estimateTotalGasCost = function (l2Provider, tx) { return __awaiter(void 0, void 0, void 0, function () {
    var l1GasCost, l2GasCost;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.estimateL1GasCost)(l2Provider, tx)];
            case 1:
                l1GasCost = _a.sent();
                return [4 /*yield*/, (0, exports.estimateL2GasCost)(l2Provider, tx)];
            case 2:
                l2GasCost = _a.sent();
                return [2 /*return*/, l1GasCost.add(l2GasCost)];
        }
    });
}); };
exports.estimateTotalGasCost = estimateTotalGasCost;
/**
 * Determines if a given Provider is an L2Provider.  Will coerce type
 * if true
 *
 * @param provider The provider to check
 * @returns Boolean
 * @example
 * if (isL2Provider(provider)) {
 *   // typescript now knows it is of type L2Provider
 *   const gasPrice = await provider.estimateL2GasPrice(tx)
 * }
 */
var isL2Provider = function (provider) {
    return Boolean(provider._isL2Provider);
};
exports.isL2Provider = isL2Provider;
/**
 * Returns an provider wrapped as an Optimism L2 provider. Adds a few extra helper functions to
 * simplify the process of estimating the gas usage for a transaction on Optimism. Returns a COPY
 * of the original provider.
 *
 * @param provider Provider to wrap into an L2 provider.
 * @returns Provider wrapped as an L2 provider.
 */
var asL2Provider = function (provider) {
    // Skip if we've already wrapped this provider.
    if ((0, exports.isL2Provider)(provider)) {
        return provider;
    }
    // Make a copy of the provider since we'll be modifying some internals and don't want to mess
    // with the original object.
    var l2Provider = (0, cloneDeep_1.default)(provider);
    // Not exactly sure when the provider wouldn't have a formatter function, but throw an error if
    // it doesn't have one. The Provider type doesn't define it but every provider I've dealt with
    // seems to have it.
    // TODO this may be fixed if library has gotten updated since
    var formatter = l2Provider.formatter;
    // assert(formatter, `provider.formatter must be defined`)
    // Modify the block formatter to return the state root. Not strictly related to Optimism, just a
    // generally useful thing that really should've been on the Ethers block object to begin with.
    // TODO: Maybe we should make a PR to add this to the Ethers library?
    var ogBlockFormatter = formatter.block.bind(formatter);
    formatter.block = function (block) {
        var parsed = ogBlockFormatter(block);
        parsed.stateRoot = block.stateRoot;
        return parsed;
    };
    // Modify the block formatter to include all the L2 fields for transactions.
    var ogBlockWithTxFormatter = formatter.blockWithTransactions.bind(formatter);
    formatter.blockWithTransactions = function (block) {
        var parsed = ogBlockWithTxFormatter(block);
        parsed.stateRoot = block.stateRoot;
        parsed.transactions = parsed.transactions.map(function (tx, idx) {
            var ogTx = block.transactions[idx];
            tx.l1BlockNumber = ogTx.l1BlockNumber
                ? (0, utils_1.toNumber)(ogTx.l1BlockNumber)
                : ogTx.l1BlockNumber;
            tx.l1Timestamp = ogTx.l1Timestamp
                ? (0, utils_1.toNumber)(ogTx.l1Timestamp)
                : ogTx.l1Timestamp;
            tx.l1TxOrigin = ogTx.l1TxOrigin;
            tx.queueOrigin = ogTx.queueOrigin;
            tx.rawTransaction = ogTx.rawTransaction;
            return tx;
        });
        return parsed;
    };
    // Modify the transaction formatter to include all the L2 fields for transactions.
    var ogTxResponseFormatter = formatter.transactionResponse.bind(formatter);
    formatter.transactionResponse = function (tx) {
        var parsed = ogTxResponseFormatter(tx);
        parsed.txType = tx.txType;
        parsed.queueOrigin = tx.queueOrigin;
        parsed.rawTransaction = tx.rawTransaction;
        parsed.l1TxOrigin = tx.l1TxOrigin;
        parsed.l1BlockNumber = tx.l1BlockNumber
            ? parseInt(tx.l1BlockNumber, 16)
            : tx.l1BlockNumbers;
        return parsed;
    };
    // Modify the receipt formatter to include all the L2 fields.
    var ogReceiptFormatter = formatter.receipt.bind(formatter);
    formatter.receipt = function (receipt) {
        var parsed = ogReceiptFormatter(receipt);
        parsed.l1GasPrice = (0, utils_1.toBigNumber)(receipt.l1GasPrice);
        parsed.l1GasUsed = (0, utils_1.toBigNumber)(receipt.l1GasUsed);
        parsed.l1Fee = (0, utils_1.toBigNumber)(receipt.l1Fee);
        parsed.l1FeeScalar = parseFloat(receipt.l1FeeScalar);
        return parsed;
    };
    // Connect extra functions.
    l2Provider.getL1GasPrice = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, exports.getL1GasPrice)(l2Provider)];
        });
    }); };
    l2Provider.estimateL1Gas = function (tx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, exports.estimateL1Gas)(l2Provider, tx)];
        });
    }); };
    l2Provider.estimateL1GasCost = function (tx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, exports.estimateL1GasCost)(l2Provider, tx)];
        });
    }); };
    l2Provider.estimateL2GasCost = function (tx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, exports.estimateL2GasCost)(l2Provider, tx)];
        });
    }); };
    l2Provider.estimateTotalGasCost = function (tx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, exports.estimateTotalGasCost)(l2Provider, tx)];
        });
    }); };
    l2Provider._isL2Provider = true;
    return l2Provider;
};
exports.asL2Provider = asL2Provider;
