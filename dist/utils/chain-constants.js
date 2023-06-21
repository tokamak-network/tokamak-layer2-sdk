"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRIDGE_ADAPTER_DATA = exports.CONTRACT_ADDRESSES = exports.DEFAULT_L2_CONTRACT_ADDRESSES = exports.CHAIN_BLOCK_TIMES = exports.DEPOSIT_CONFIRMATION_BLOCKS = void 0;
var contracts_1 = require("@eth-optimism/contracts");
var contracts_bedrock_1 = require("@eth-optimism/contracts-bedrock");
var interfaces_1 = require("../interfaces");
var adapters_1 = require("../adapters");
exports.DEPOSIT_CONFIRMATION_BLOCKS = (_a = {},
    _a[interfaces_1.L2ChainID.OPTIMISM] = 50,
    _a[interfaces_1.L2ChainID.OPTIMISM_GOERLI] = 12,
    _a[interfaces_1.L2ChainID.OPTIMISM_KOVAN] = 12,
    _a[interfaces_1.L2ChainID.OPTIMISM_HARDHAT_LOCAL] = 2,
    _a[interfaces_1.L2ChainID.OPTIMISM_HARDHAT_DEVNET] = 2,
    _a[interfaces_1.L2ChainID.OPTIMISM_BEDROCK_LOCAL_DEVNET] = 2,
    _a[interfaces_1.L2ChainID.OPTIMISM_BEDROCK_ALPHA_TESTNET] = 12,
    _a[interfaces_1.L2ChainID.TOKAMAK_GOERLI_TESTNET] = 2,
    _a[interfaces_1.L2ChainID.TITAN] = 2,
    _a);
exports.CHAIN_BLOCK_TIMES = (_b = {},
    _b[interfaces_1.L1ChainID.MAINNET] = 13,
    _b[interfaces_1.L1ChainID.GOERLI] = 15,
    _b[interfaces_1.L1ChainID.KOVAN] = 4,
    _b[interfaces_1.L1ChainID.HARDHAT_LOCAL] = 1,
    _b[interfaces_1.L1ChainID.BEDROCK_LOCAL_DEVNET] = 15,
    _b);
/**
 * Full list of default L2 contract addresses.
 * TODO(tynes): migrate to predeploys from contracts-bedrock
 */
exports.DEFAULT_L2_CONTRACT_ADDRESSES = {
    L2CrossDomainMessenger: contracts_1.predeploys.L2CrossDomainMessenger,
    L2ToL1MessagePasser: contracts_1.predeploys.OVM_L2ToL1MessagePasser,
    L2StandardBridge: contracts_1.predeploys.L2StandardBridge,
    OVM_L1BlockNumber: contracts_1.predeploys.OVM_L1BlockNumber,
    OVM_L2ToL1MessagePasser: contracts_1.predeploys.OVM_L2ToL1MessagePasser,
    OVM_DeployerWhitelist: contracts_1.predeploys.OVM_DeployerWhitelist,
    OVM_ETH: contracts_1.predeploys.OVM_ETH,
    OVM_GasPriceOracle: contracts_1.predeploys.OVM_GasPriceOracle,
    OVM_SequencerFeeVault: contracts_1.predeploys.OVM_SequencerFeeVault,
    WETH: contracts_1.predeploys.WETH9,
    BedrockMessagePasser: contracts_bedrock_1.predeploys.L2ToL1MessagePasser,
};
/**
 * Loads the L1 contracts for a given network by the network name.
 *
 * @param network The name of the network to load the contracts for.
 * @returns The L1 contracts for the given network.
 */
var getL1ContractsByNetworkName = function (network) {
    var getDeployedAddress = function (name) {
        return (0, contracts_1.getDeployedContractDefinition)(name, network).address;
    };
    return {
        AddressManager: getDeployedAddress('Lib_AddressManager'),
        L1CrossDomainMessenger: getDeployedAddress('Proxy__OVM_L1CrossDomainMessenger'),
        L1StandardBridge: getDeployedAddress('Proxy__OVM_L1StandardBridge'),
        StateCommitmentChain: getDeployedAddress('StateCommitmentChain'),
        CanonicalTransactionChain: getDeployedAddress('CanonicalTransactionChain'),
        BondManager: getDeployedAddress('BondManager'),
        OptimismPortal: '0x0000000000000000000000000000000000000000',
        L2OutputOracle: '0x0000000000000000000000000000000000000000',
    };
};
/**
 * Mapping of L1 chain IDs to the appropriate contract addresses for the OE deployments to the
 * given network. Simplifies the process of getting the correct contract addresses for a given
 * contract name.
 */
exports.CONTRACT_ADDRESSES = (_c = {},
    _c[interfaces_1.L2ChainID.OPTIMISM] = {
        l1: getL1ContractsByNetworkName('mainnet'),
        l2: exports.DEFAULT_L2_CONTRACT_ADDRESSES,
    },
    _c[interfaces_1.L2ChainID.OPTIMISM_KOVAN] = {
        l1: getL1ContractsByNetworkName('kovan'),
        l2: exports.DEFAULT_L2_CONTRACT_ADDRESSES,
    },
    _c[interfaces_1.L2ChainID.OPTIMISM_GOERLI] = {
        l1: getL1ContractsByNetworkName('goerli'),
        l2: exports.DEFAULT_L2_CONTRACT_ADDRESSES,
    },
    _c[interfaces_1.L2ChainID.OPTIMISM_HARDHAT_LOCAL] = {
        l1: {
            AddressManager: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            L1CrossDomainMessenger: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
            L1StandardBridge: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
            StateCommitmentChain: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
            CanonicalTransactionChain: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
            BondManager: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            OptimismPortal: '0x0000000000000000000000000000000000000000',
            L2OutputOracle: '0x0000000000000000000000000000000000000000',
        },
        l2: exports.DEFAULT_L2_CONTRACT_ADDRESSES,
    },
    _c[interfaces_1.L2ChainID.OPTIMISM_HARDHAT_DEVNET] = {
        l1: {
            AddressManager: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            L1CrossDomainMessenger: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
            L1StandardBridge: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
            StateCommitmentChain: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
            CanonicalTransactionChain: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
            BondManager: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
            OptimismPortal: '0x0000000000000000000000000000000000000000',
            L2OutputOracle: '0x0000000000000000000000000000000000000000',
        },
        l2: exports.DEFAULT_L2_CONTRACT_ADDRESSES,
    },
    _c[interfaces_1.L2ChainID.OPTIMISM_BEDROCK_LOCAL_DEVNET] = {
        l1: {
            AddressManager: '0x6900000000000000000000000000000000000005',
            L1CrossDomainMessenger: '0x6900000000000000000000000000000000000002',
            L1StandardBridge: '0x6900000000000000000000000000000000000003',
            StateCommitmentChain: '0x0000000000000000000000000000000000000000',
            CanonicalTransactionChain: '0x0000000000000000000000000000000000000000',
            BondManager: '0x0000000000000000000000000000000000000000',
            OptimismPortal: '0x6900000000000000000000000000000000000001',
            L2OutputOracle: '0x6900000000000000000000000000000000000000',
        },
        l2: exports.DEFAULT_L2_CONTRACT_ADDRESSES,
    },
    _c[interfaces_1.L2ChainID.OPTIMISM_BEDROCK_ALPHA_TESTNET] = {
        l1: {
            AddressManager: '0xb4e08DcE1F323608229265c9d4125E22a4B9dbAF',
            L1CrossDomainMessenger: '0x838a6DC4E37CA45D4Ef05bb776bf05eEf50798De',
            L1StandardBridge: '0xFf94B6C486350aD92561Ba09bad3a59df764Da92',
            StateCommitmentChain: '0x0000000000000000000000000000000000000000',
            CanonicalTransactionChain: '0x0000000000000000000000000000000000000000',
            BondManager: '0x0000000000000000000000000000000000000000',
            OptimismPortal: '0xA581Ca3353DB73115C4625FFC7aDF5dB379434A8',
            L2OutputOracle: '0x3A234299a14De50027eA65dCdf1c0DaC729e04A6',
        },
        l2: exports.DEFAULT_L2_CONTRACT_ADDRESSES,
    },
    _c[interfaces_1.L2ChainID.TOKAMAK_GOERLI_TESTNET] = {
        l1: {
            AddressManager: '0xEFa07e4263D511fC3a7476772e2392efFb1BDb92',
            L1CrossDomainMessenger: '0x2878373BA3Be0Ef2a93Ba5b3F7210D76cb222e63',
            L1StandardBridge: '0x7377F3D0F64d7a54Cf367193eb74a052ff8578FD',
            StateCommitmentChain: '0xd52E839b21cE302B15f7652Dc44Cb33841450418',
            CanonicalTransactionChain: '0x1D288952363B14B6BEEFA6A5fB2990203963F399',
            BondManager: '0x55c16359C5254Ade092DF94C9B858D4810cB2774',
            OptimismPortal: '0x0000000000000000000000000000000000000000',
            L2OutputOracle: '0x0000000000000000000000000000000000000000',
        },
        l2: exports.DEFAULT_L2_CONTRACT_ADDRESSES,
    },
    _c[interfaces_1.L2ChainID.TITAN] = {
        l1: {
            AddressManager: '0xeDf6C92fA72Fa6015B15C9821ada145a16c85571',
            L1CrossDomainMessenger: '0xfd76ef26315Ea36136dC40Aeafb5D276d37944AE',
            L1StandardBridge: '0x59aa194798Ba87D26Ba6bEF80B85ec465F4bbcfD',
            StateCommitmentChain: '0x66b9f45E84A0aD7fE3983c97556798352a8E0a56',
            CanonicalTransactionChain: '0x4A1941f18874Df01e5CAA1CD3DA4b1803CBD32C2',
            BondManager: '0xAD4765d7729946cF7c3C7acBE9DC5E220A98e944',
            OptimismPortal: '0x0000000000000000000000000000000000000000',
            L2OutputOracle: '0x0000000000000000000000000000000000000000',
        },
        l2: exports.DEFAULT_L2_CONTRACT_ADDRESSES,
    },
    _c);
/**
 * Mapping of L1 chain IDs to the list of custom bridge addresses for each chain.
 */
exports.BRIDGE_ADAPTER_DATA = (_d = {},
    _d[interfaces_1.L2ChainID.OPTIMISM] = {
        wstETH: {
            Adapter: adapters_1.DAIBridgeAdapter,
            l1Bridge: '0x76943C0D61395d8F2edF9060e1533529cAe05dE6',
            l2Bridge: '0x8E01013243a96601a86eb3153F0d9Fa4fbFb6957',
        },
        BitBTC: {
            Adapter: adapters_1.StandardBridgeAdapter,
            l1Bridge: '0xaBA2c5F108F7E820C049D5Af70B16ac266c8f128',
            l2Bridge: '0x158F513096923fF2d3aab2BcF4478536de6725e2',
        },
        DAI: {
            Adapter: adapters_1.DAIBridgeAdapter,
            l1Bridge: '0x10E6593CDda8c58a1d0f14C5164B376352a55f2F',
            l2Bridge: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
        },
    },
    _d[interfaces_1.L2ChainID.OPTIMISM_KOVAN] = {
        wstETH: {
            Adapter: adapters_1.DAIBridgeAdapter,
            l1Bridge: '0x65321bf24210b81500230dCEce14Faa70a9f50a7',
            l2Bridge: '0x2E34e7d705AfaC3C4665b6feF31Aa394A1c81c92',
        },
        BitBTC: {
            Adapter: adapters_1.StandardBridgeAdapter,
            l1Bridge: '0x0b651A42F32069d62d5ECf4f2a7e5Bd3E9438746',
            l2Bridge: '0x0CFb46528a7002a7D8877a5F7a69b9AaF1A9058e',
        },
        USX: {
            Adapter: adapters_1.StandardBridgeAdapter,
            l1Bridge: '0x40E862341b2416345F02c41Ac70df08525150dC7',
            l2Bridge: '0xB4d37826b14Cd3CB7257A2A5094507d701fe715f',
        },
        DAI: {
            Adapter: adapters_1.DAIBridgeAdapter,
            l1Bridge: '0xb415e822C4983ecD6B1c1596e8a5f976cf6CD9e3',
            l2Bridge: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
        },
    },
    _d[interfaces_1.L2ChainID.OPTIMISM_GOERLI] = {
        DAI: {
            Adapter: adapters_1.DAIBridgeAdapter,
            l1Bridge: '0x05a388Db09C2D44ec0b00Ee188cD42365c42Df23',
            l2Bridge: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
        },
    },
    _d);
