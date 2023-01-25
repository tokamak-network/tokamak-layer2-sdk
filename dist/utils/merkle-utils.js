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
exports.makeStateTrieProof = exports.makeMerkleTreeProof = void 0;
/* Imports: External */
var ethers_1 = require("ethers");
var core_utils_1 = require("@eth-optimism/core-utils");
var merkletreejs_1 = require("merkletreejs");
/**
 * Generates a Merkle proof (using the particular scheme we use within Lib_MerkleTree).
 *
 * @param leaves Leaves of the merkle tree.
 * @param index Index to generate a proof for.
 * @returns Merkle proof sibling leaves, as hex strings.
 */
var makeMerkleTreeProof = function (leaves, index) {
    // Our specific Merkle tree implementation requires that the number of leaves is a power of 2.
    // If the number of given leaves is less than a power of 2, we need to round up to the next
    // available power of 2. We fill the remaining space with the hash of bytes32(0).
    var correctedTreeSize = Math.pow(2, Math.ceil(Math.log2(leaves.length)));
    var parsedLeaves = [];
    for (var i = 0; i < correctedTreeSize; i++) {
        if (i < leaves.length) {
            parsedLeaves.push(leaves[i]);
        }
        else {
            parsedLeaves.push(ethers_1.ethers.utils.keccak256('0x' + '00'.repeat(32)));
        }
    }
    // merkletreejs prefers things to be Buffers.
    var bufLeaves = parsedLeaves.map(core_utils_1.fromHexString);
    var tree = new merkletreejs_1.MerkleTree(bufLeaves, function (el) {
        return (0, core_utils_1.fromHexString)(ethers_1.ethers.utils.keccak256(el));
    });
    var proof = tree.getProof(bufLeaves[index], index).map(function (element) {
        return (0, core_utils_1.toHexString)(element.data);
    });
    return proof;
};
exports.makeMerkleTreeProof = makeMerkleTreeProof;
/**
 * Generates a Merkle-Patricia trie proof for a given account and storage slot.
 *
 * @param provider RPC provider attached to an EVM-compatible chain.
 * @param blockNumber Block number to generate the proof at.
 * @param address Address to generate the proof for.
 * @param slot Storage slot to generate the proof for.
 * @returns Account proof and storage proof.
 */
var makeStateTrieProof = function (provider, blockNumber, address, slot) { return __awaiter(void 0, void 0, void 0, function () {
    var proof;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, provider.send('eth_getProof', [
                    address,
                    [slot],
                    (0, core_utils_1.toRpcHexString)(blockNumber),
                ])];
            case 1:
                proof = _a.sent();
                return [2 /*return*/, {
                        accountProof: proof.accountProof,
                        storageProof: proof.storageProof[0].proof,
                        storageValue: ethers_1.BigNumber.from(proof.storageProof[0].value),
                        storageRoot: proof.storageHash,
                    }];
        }
    });
}); };
exports.makeStateTrieProof = makeStateTrieProof;
