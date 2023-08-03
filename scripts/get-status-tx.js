#! /usr/local/bin/node

// ERC-20 transfers between L1 and L2 using the Optimism SDK

const ethers = require("ethers")
// const optimismSDK = require("@eth-optimism/sdk")
const optimismSDK = require("../dist/index")

require('dotenv').config()
const L1CrossDomainMessengerABI = require("./abis/L1CrossDomainMessenger.json");

const L1CrossDomainMessengerAddress = '0x2878373BA3Be0Ef2a93Ba5b3F7210D76cb222e63'
//0xa9f9e67500000000000000000000000068c1f9620aec7f2913430ad6dac1bb16d8444f000000000000000000000000007c6b91d9be155a6db01f749217d76ff02a7227f2000000000000000000000000c1eba383d94c6021160042491a5dfaf1d82694e600000000000000000000000051ab33d511a74abefdce2d4addb92991b73f89370000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000a4a41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004b2068656c6c6f206c32206d7367203a202c5765642041707220313920323032332031393a32303a313520474d542b303930302028eb8c80ed959cebafbceab5ad20ed919ceca480ec8b9c2900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
//0xa9f9e67500000000000000000000000068c1f9620aec7f2913430ad6dac1bb16d8444f000000000000000000000000007c6b91d9be155a6db01f749217d76ff02a7227f2000000000000000000000000c1eba383d94c6021160042491a5dfaf1d82694e600000000000000000000000051ab33d511a74abefdce2d4addb92991b73f89370000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000a4a41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004b2068656c6c6f206c32206d7367203a202c5765642041707220313920323032332031393a32353a303120474d542b303930302028eb8c80ed959cebafbceab5ad20ed919ceca480ec8b9c2900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
const MessageDirection = {
  L1_TO_L2: 0,
  L2_TO_L1: 1,
}

const l1Url = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
const l2Url = `https://goerli.optimism.tokamak.network`

// Contract addresses for OPTb tokens, taken
// from https://github.com/ethereum-optimism/ethereum-optimism.github.io/blob/master/data/OUTb/data.json

const bridge = {
  l1Bridge: "0x7377F3D0F64d7a54Cf367193eb74a052ff8578FD",
  l2Bridge: "0x4200000000000000000000000000000000000010"
}

// TON
const erc20Addrs = {
  l1Addr: "0x68c1F9620aeC7F2913430aD6daC1bb16D8444F00",
  l2Addr: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2"
}    // erc20Addrs

const greeter = {
  l1Greeter: "0x51aB33d511a74aBeFDce2d4AddB92991B73F8937",
  l2Greeter: "0xDe6b80f4700C2148Ba2aF81640a23E153C007C7F"
}

// To learn how to deploy an L2 equivalent to an L1 ERC-20 contract,
// see here:
// https://github.com/ethereum-optimism/optimism-tutorial/tree/main/standard-bridge-standard-token


// Global variable because we need them almost everywhere
let crossChainMessenger
let l1ERC20, l2ERC20    // OUTb contracts to show ERC-20 transfers
let ourAddr             // The address of the signer we use.
let recipient = "0x5b6e72248b19F2c5b88A4511A6994AD101d0c287"
let l1Greeter, l2Greeter
let l1CrossChainMessenger

// Get signers on L1 and L2 (for the same address). Note that
// this address needs to have ETH on it, both on Optimism and
// Optimism Georli
const getSigners = async () => {
    const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)
    const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url)
    const privateKey = process.env.PRIVATE_KEY
    const l1Wallet = new ethers.Wallet(privateKey, l1RpcProvider)
    const l2Wallet = new ethers.Wallet(privateKey, l2RpcProvider)

    return [l1Wallet, l2Wallet]
}   // getSigners

// The ABI fragment for the contract. We only need to know how to do two things:
// 1. Get an account's balance
// 2. Call the faucet to get more (only works on L1). Of course, production
//    ERC-20 tokens tend to be a bit harder to acquire.
const erc20ABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // approve
  {
    constant: true,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  // faucet
  {
    inputs: [],
    name: "faucet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
]    // erc20ABI

const BridgeABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "deposits",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_l1Token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_l2Token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "finalizeERC20Withdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]


const setup = async() => {
  const [l1Signer, l2Signer] = await getSigners()
  ourAddr = l1Signer.address

  crossChainMessenger = new optimismSDK.CrossChainMessenger({
      l1ChainId: 5,    // Goerli value, 1 for mainnet
      l2ChainId: 5050,  // Goerli value, 10 for mainnet
      l1SignerOrProvider: l1Signer,
      l2SignerOrProvider: l2Signer
  })

  // console.log('crossChainMessenger',crossChainMessenger);

  l1Bridge = new ethers.Contract(bridge.l1Bridge, BridgeABI, l1Signer)
  l1ERC20 = new ethers.Contract(erc20Addrs.l1Addr, erc20ABI, l1Signer)
  l2ERC20 = new ethers.Contract(erc20Addrs.l2Addr, erc20ABI, l2Signer)

  l1CrossChainMessenger = new ethers.Contract(L1CrossDomainMessengerAddress, L1CrossDomainMessengerABI.abi, l1Signer)

}    // setup

const checkTransaction = async (tx) => {
  console.log(`\n`)

  const start = new Date()
  console.log(`\n`)
  console.log(`Transaction hash (on L2): ${tx}`)
  console.log(`\tFor more information: https://goerli.explorer.tokamak.network/tx/${tx}`)
  console.log(`\n`)

  const resolved = await crossChainMessenger.toCrossChainMessage(tx)
  // console.log(`resolved : `, resolved)
  const receipt = await crossChainMessenger.getMessageReceipt(resolved)
  // console.log(`receipt : `, receipt)

  if(receipt!= null && receipt.transactionReceipt != null )
    console.log(`match tx: `, receipt.transactionReceipt.transactionHash )

}


const main = async () => {
    await setup()
    let l2tx = "0x39672ddeac27fcb7336e0ea73e5f9aead31fe73ec2cfe9d14398370c0bd6d84d"
    await checkTransaction(l2tx)


}  // main

main().then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

