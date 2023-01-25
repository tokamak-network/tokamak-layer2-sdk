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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBridgeAdapters = exports.getAllOEContracts = exports.getOEContract = void 0;
var contracts_1 = require("@eth-optimism/contracts");
var contracts_bedrock_1 = require("@eth-optimism/contracts-bedrock");
var ethers_1 = require("ethers");
var coercion_1 = require("./coercion");
var adapters_1 = require("../adapters");
var chain_constants_1 = require("./chain-constants");
/**
 * We've changed some contract names in this SDK to be a bit nicer. Here we remap these nicer names
 * back to the original contract names so we can look them up.
 */
// const NAME_REMAPPING = {
//   AddressManager: 'Lib_AddressManager' as const,
//   OVM_L1BlockNumber: 'iOVM_L1BlockNumber' as const,
//   WETH: 'WETH9' as const,
//   BedrockMessagePasser: 'L2ToL1MessagePasser' as const,
// }
var NAME_REMAPPING = {
    AddressManager: 'AddressManager',
    OVM_L1BlockNumber: 'iOVM_L1BlockNumber',
    WETH: 'WETH9',
    BedrockMessagePasser: 'L2ToL1MessagePasser',
};
/**
 * Returns an ethers.Contract object for the given name, connected to the appropriate address for
 * the given L2 chain ID. Users can also provide a custom address to connect the contract to
 * instead. If the chain ID is not known then the user MUST provide a custom address or this
 * function will throw an error.
 *
 * @param contractName Name of the contract to connect to.
 * @param l2ChainId Chain ID for the L2 network.
 * @param opts Additional options for connecting to the contract.
 * @param opts.address Custom address to connect to the contract.
 * @param opts.signerOrProvider Signer or provider to connect to the contract.
 * @returns An ethers.Contract object connected to the appropriate address and interface.
 */
var getOEContract = function (contractName, l2ChainId, opts) {
    if (opts === void 0) { opts = {}; }
    var addresses = chain_constants_1.CONTRACT_ADDRESSES[l2ChainId];
    if (addresses === undefined && opts.address === undefined) {
        throw new Error("cannot get contract ".concat(contractName, " for unknown L2 chain ID ").concat(l2ChainId, ", you must provide an address"));
    }
    // Bedrock interfaces are backwards compatible. We can prefer Bedrock interfaces over legacy
    // interfaces if they exist.
    var name = NAME_REMAPPING[contractName] || contractName;
    var iface;
    try {
        iface = (0, contracts_bedrock_1.getContractInterface)(name);
    }
    catch (err) {
        iface = (0, contracts_1.getContractInterface)(name);
    }
    return new ethers_1.Contract((0, coercion_1.toAddress)(opts.address || addresses.l1[contractName] || addresses.l2[contractName]), iface, opts.signerOrProvider);
};
exports.getOEContract = getOEContract;
/**
 * Automatically connects to all contract addresses, both L1 and L2, for the given L2 chain ID. The
 * user can provide custom contract address overrides for L1 or L2 contracts. If the given chain ID
 * is not known then the user MUST provide custom contract addresses for ALL L1 contracts or this
 * function will throw an error.
 *
 * @param l2ChainId Chain ID for the L2 network.
 * @param opts Additional options for connecting to the contracts.
 * @param opts.l1SignerOrProvider: Signer or provider to connect to the L1 contracts.
 * @param opts.l2SignerOrProvider: Signer or provider to connect to the L2 contracts.
 * @param opts.overrides Custom contract address overrides for L1 or L2 contracts.
 * @returns An object containing ethers.Contract objects connected to the appropriate addresses on
 * both L1 and L2.
 */
var getAllOEContracts = function (l2ChainId, opts) {
    var _a, _b, _c, _d;
    if (opts === void 0) { opts = {}; }
    var addresses = chain_constants_1.CONTRACT_ADDRESSES[l2ChainId] || {
        l1: {
            AddressManager: undefined,
            L1CrossDomainMessenger: undefined,
            L1StandardBridge: undefined,
            StateCommitmentChain: undefined,
            CanonicalTransactionChain: undefined,
            BondManager: undefined,
            OptimismPortal: undefined,
            L2OutputOracle: undefined,
        },
        l2: chain_constants_1.DEFAULT_L2_CONTRACT_ADDRESSES,
    };
    // Attach all L1 contracts.
    var l1Contracts = {};
    for (var _i = 0, _e = Object.entries(addresses.l1); _i < _e.length; _i++) {
        var _f = _e[_i], contractName = _f[0], contractAddress = _f[1];
        l1Contracts[contractName] = (0, exports.getOEContract)(contractName, l2ChainId, {
            address: ((_b = (_a = opts.overrides) === null || _a === void 0 ? void 0 : _a.l1) === null || _b === void 0 ? void 0 : _b[contractName]) || contractAddress,
            signerOrProvider: opts.l1SignerOrProvider,
        });
    }
    // Attach all L2 contracts.
    var l2Contracts = {};
    for (var _g = 0, _h = Object.entries(addresses.l2); _g < _h.length; _g++) {
        var _j = _h[_g], contractName = _j[0], contractAddress = _j[1];
        l2Contracts[contractName] = (0, exports.getOEContract)(contractName, l2ChainId, {
            address: ((_d = (_c = opts.overrides) === null || _c === void 0 ? void 0 : _c.l2) === null || _d === void 0 ? void 0 : _d[contractName]) || contractAddress,
            signerOrProvider: opts.l2SignerOrProvider,
        });
    }
    return {
        l1: l1Contracts,
        l2: l2Contracts,
    };
};
exports.getAllOEContracts = getAllOEContracts;
/**
 * Gets a series of bridge adapters for the given L2 chain ID.
 *
 * @param l2ChainId Chain ID for the L2 network.
 * @param messenger Cross chain messenger to connect to the bridge adapters
 * @param opts Additional options for connecting to the custom bridges.
 * @param opts.overrides Custom bridge adapters.
 * @returns An object containing all bridge adapters
 */
var getBridgeAdapters = function (l2ChainId, messenger, opts) {
    var _a, _b, _c, _d;
    var adapterData = __assign(__assign(__assign({}, (chain_constants_1.CONTRACT_ADDRESSES[l2ChainId]
        ? {
            Standard: {
                Adapter: adapters_1.StandardBridgeAdapter,
                l1Bridge: ((_b = (_a = opts.contracts) === null || _a === void 0 ? void 0 : _a.l1) === null || _b === void 0 ? void 0 : _b.L1StandardBridge) ||
                    chain_constants_1.CONTRACT_ADDRESSES[l2ChainId].l1.L1StandardBridge,
                l2Bridge: contracts_1.predeploys.L2StandardBridge,
            },
            ETH: {
                Adapter: adapters_1.ETHBridgeAdapter,
                l1Bridge: ((_d = (_c = opts.contracts) === null || _c === void 0 ? void 0 : _c.l1) === null || _d === void 0 ? void 0 : _d.L1StandardBridge) ||
                    chain_constants_1.CONTRACT_ADDRESSES[l2ChainId].l1.L1StandardBridge,
                l2Bridge: contracts_1.predeploys.L2StandardBridge,
            },
        }
        : {})), (chain_constants_1.BRIDGE_ADAPTER_DATA[l2ChainId] || {})), ((opts === null || opts === void 0 ? void 0 : opts.overrides) || {}));
    var adapters = {};
    for (var _i = 0, _e = Object.entries(adapterData); _i < _e.length; _i++) {
        var _f = _e[_i], bridgeName = _f[0], bridgeData = _f[1];
        adapters[bridgeName] = new bridgeData.Adapter({
            messenger: messenger,
            l1Bridge: bridgeData.l1Bridge,
            l2Bridge: bridgeData.l2Bridge,
        });
    }
    return adapters;
};
exports.getBridgeAdapters = getBridgeAdapters;
