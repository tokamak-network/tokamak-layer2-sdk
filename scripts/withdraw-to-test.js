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

const GreeterABI = [
  {
    "inputs": [
    ],
    "name": "greet",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_greeting", type: "string" } ],
    name: "setGreeting",
    outputs: [],
    type: "function",
  },
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
  l1Greeter = new ethers.Contract(greeter.l1Greeter, GreeterABI, l1Signer)
  l2Greeter = new ethers.Contract(greeter.l2Greeter, GreeterABI, l2Signer)
  l1CrossChainMessenger = new ethers.Contract(L1CrossDomainMessengerAddress, L1CrossDomainMessengerABI.abi, l1Signer)

}    // setup


const reportGreet = async () => {
  const l1greet = await l1Greeter["greet()"]()
  const l2greet = await l2Greeter.greet()

  console.log(`l1greet:${l1greet} `)
  console.log(`l2greet:${l2greet} `)

  return
}    // reportGreet


const reportBridgeBalances = async () => {

  const deposits = (await l1Bridge.deposits(erc20Addrs.l1Addr, erc20Addrs.l2Addr)).toString().slice(0,-18)

  console.log(`deposits in Bridge : ${deposits} `)
  return

}    // reportBridgeBalances


const reportERC20Balances = async () => {
  const l1Balance = (await l1ERC20.balanceOf(ourAddr)).toString().slice(0,-18)
  const l2Balance = (await l2ERC20.balanceOf(ourAddr)).toString().slice(0,-18)

  console.log(`ourAddr:${ourAddr} `)
  console.log(`OUTb on L1:${l1Balance}     OUTb on L2:${l2Balance}`)

  if (l1Balance != 0) {
    return
  }

  /*
  console.log(`You don't have enough OUTb on L1. Let's call the faucet to fix that`)
  const tx = (await l1ERC20.faucet())
  console.log(`Faucet tx: ${tx.hash}`)
  console.log(`\tMore info: https://goerli.etherscan.io/tx/${tx.hash}`)
  await tx.wait()
  const newBalance = (await l1ERC20.balanceOf(ourAddr)).toString().slice(0,-18)
  console.log(`New L1 OUTb balance: ${newBalance}`)
  */
}    // reportGreet


const oneToken = BigInt(1e18)
// const tenToken = ethers.utils.parseEther("10")
const depositAmount = ethers.utils.parseEther("1")


const depositERC20 = async () => {
  console.log(`\n`)
  console.log("Deposit ERC20")
  await reportERC20Balances()
  console.log(`\n`)
  const start = new Date()

  // Need the l2 address to know which bridge is responsible
  const allowanceResponse = await crossChainMessenger.approveERC20(
    erc20Addrs.l1Addr, erc20Addrs.l2Addr, depositAmount)
  await allowanceResponse.wait()
  console.log(`Allowance given by tx ${allowanceResponse.hash}`)
  console.log(`\tMore info: https://goerli.etherscan.io/tx/${allowanceResponse.hash}`)
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)
  console.log(`\n`)
  const response = await crossChainMessenger.depositERC20(
    erc20Addrs.l1Addr, erc20Addrs.l2Addr, depositAmount)
  console.log(`Deposit transaction hash (on L1): ${response.hash}`)
  console.log(`\tMore info: https://goerli.etherscan.io/tx/${response.hash}`)
  await response.wait()
  console.log("Waiting for status to change to RELAYED")
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)
  await crossChainMessenger.waitForMessageStatus(response.hash, optimismSDK.MessageStatus.RELAYED)

  console.log(`depositERC20 took ${(new Date()-start)/1000} seconds\n\n`)
  await reportERC20Balances()
  console.log(`\n`)

}     // depositERC20()


const getBlock = async (blockNumber) => {
  const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)
  let data = await l1RpcProvider.getBlock(blockNumber)

  console.log(data);
};

const getTransaction = async (tx) => {
  const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)
  let data = await l1RpcProvider.getTransactionReceipt(tx)

  console.log(data);
};

const getHashMessage  = async (from, to, amount, calldata, _messageNonce) => {

  let iBridge = new ethers.utils.Interface(BridgeABI);
  const message = iBridge.encodeFunctionData("finalizeERC20Withdrawal",
          [
              erc20Addrs.l1Addr,
              erc20Addrs.l2Addr,
              from,
              to,
              amount,
              calldata ]
          );

  // console.log('*** finalizeERC20Withdrawal message', message)

  let iCrossMessege = new ethers.utils.Interface(L1CrossDomainMessengerABI.abi);
  let tx = iCrossMessege.encodeFunctionData("relayMessage",
  [
      bridge.l1Bridge,
      bridge.l2Bridge,
      message,
      _messageNonce ]
  );

  console.log('*** relayMessage ', tx)

  let hashMessage = await ethers.utils.keccak256(tx);
  return  hashMessage;
}

const withdrawERC20 = async () => {
  console.log(`\n`)

  // await getBlock(3369);
  await getTransaction('0x9a2add02d590a6bc0ab634c057ca0f7a45a57c6841f271f4bf665e8b9cf27a5b');

  console.log("Withdraw ERC20")
  const start = new Date()
  await reportERC20Balances()
  console.log(`\n`)

  console.log('l1Greeter.address', l1Greeter.address);

  const l1_toBalancePrev = (await l1ERC20.balanceOf(l1Greeter.address)).toString().slice(0,-18)
  console.log("Balance Before", l1Greeter.address, l1_toBalancePrev)

  //
  let iface = new ethers.utils.Interface(GreeterABI);
  // let message = 'hello l2 msg'
  // let callData = iface.encodeFunctionData("setGreeting", [message])
  // console.log('l1Greeter.address' ,l1Greeter.address)
  // console.log('message' ,message)
  // console.log('callData', callData);
  let callData = '0x'

  let hashMessage = await getHashMessage(
    ourAddr,
    l1Greeter.address,
    depositAmount ,
    callData,
    ethers.BigNumber.from("100069")
    )
  // console.log('hashMessage', hashMessage);


  let successfulMessagesBefore_1 = await l1CrossChainMessenger.successfulMessages(hashMessage);
  console.log('successfulMessagesBefore_1', successfulMessagesBefore_1);

  /*
  //
  const response = await crossChainMessenger.withdrawERC20(
    erc20Addrs.l1Addr, erc20Addrs.l2Addr, depositAmount,
    {
      recipient: l1Greeter.address,
      data: callData
    })

  console.log(`Transaction hash (on L2): ${response.hash}`)
  console.log(`\tFor more information: https://goerli.explorer.tokamak.network/tx/${response.hash}`)
  await response.wait()
  console.log(`\n`)
  console.log("Waiting for status to change to IN_CHALLENGE_PERIOD")
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)
  await crossChainMessenger.waitForMessageStatus(response.hash, optimismSDK.MessageStatus.IN_CHALLENGE_PERIOD)
  console.log("In the challenge period, waiting for status READY_FOR_RELAY")
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)
  await crossChainMessenger.waitForMessageStatus(response.hash, optimismSDK.MessageStatus.READY_FOR_RELAY)
  console.log("Ready for relay, finalizing message now")
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)
  await crossChainMessenger.finalizeMessage(response)
  console.log("Waiting for status to change to RELAYED")
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)
  await crossChainMessenger.waitForMessageStatus(response, optimismSDK.MessageStatus.RELAYED)

  console.log(`withdrawERC20 took ${(new Date()-start)/1000} seconds\n\n\n`)

  await reportERC20Balances()

  const l1_toBalanceAfter = (await l1ERC20.balanceOf(l1Greeter.address)).toString().slice(0,-18)
  console.log("Balance After", l1Greeter.address, l1_toBalanceAfter)

  let successfulMessagesAfter = await l1CrossChainMessenger.successfulMessages(hashMessage);
  console.log('successfulMessagesAfter', successfulMessagesAfter);
    */
}     // withdrawERC20()


const communicationMessage = async () => {
  const [l1Signer, l2Signer] = await getSigners()
  console.log(`\n`)

  await reportGreet()
  const start = new Date()

  let iface = new ethers.utils.Interface(GreeterABI);

  // Need the l2 address to know which bridge is responsible
  const sendMessageResponse = await crossChainMessenger.sendMessage(
    {
      direction: MessageDirection.L1_TO_L2,
      target: l2Greeter.address,
      message: iface.encodeFunctionData("setGreeting(string)", ['Hello           , L1_TO_L2,' +  new Date()])
    },{
      l2GasLimit: 200000
    }
  );
  await sendMessageResponse.wait()
  console.log(`SendMessage given by tx ${sendMessageResponse.hash}`)
  console.log(`\tMore info: https://goerli.etherscan.io/tx/${sendMessageResponse.hash}`)
  console.log(`Time so far ${(new Date()-start)/1000} seconds`)

  console.log(`\n`)
  await crossChainMessenger.waitForMessageStatus(sendMessageResponse.hash, optimismSDK.MessageStatus.RELAYED)
  console.log(`RELAYED, Time so far ${(new Date()-start)/1000} seconds`)

  await reportGreet()
  console.log(`\n`)

  const start1 = new Date()
  const response = await crossChainMessenger.sendMessage(
    {
      direction: MessageDirection.L2_TO_L1,
      target: l1Greeter.address,
      message: iface.encodeFunctionData("setGreeting(string)",['Nice To Meet You, L2_TO_L1,' +  new Date()])
    }
  )
  console.log(`Reply transaction hash (on L1): ${response.hash}`)
  console.log(`\tMore info: https://goerli.etherscan.io/tx/${response.hash}`)

  await response.wait()
  console.log("Waiting for status to change to RELAYED")
  console.log(`Time so far ${(new Date()-start1)/1000} seconds`)

  await crossChainMessenger.waitForMessageStatus(response.hash, optimismSDK.MessageStatus.RELAYED)
  console.log(`RELAYED, Time so far ${(new Date()-start1)/1000} seconds`)

  console.log(`\n`)

  await reportGreet()
  // console.log(`\n`)
  // console.log(`communicationMessage took ${(new Date ()-start)/1000} seconds\n\n`)

}     // communicationMessage()


const main = async () => {
    await setup()

    let boolERC20Deposit = process.env.testERC20Deposit;
    let boolERC20Withdraw = process.env.testERC20Withdraw;
    let boolMessageTest = process.env.testMessageTest;

    console.log(`\n boolERC20Deposit `,boolERC20Deposit)
    console.log(`\n boolERC20Withdraw `, boolERC20Withdraw)
    console.log(`\n boolMessageTest`, boolMessageTest)

    if (boolERC20Deposit == "1") {
      await reportBridgeBalances();
      await depositERC20()
      await reportBridgeBalances();
    }
    if (boolERC20Withdraw == "1") {
       await reportBridgeBalances();
       await withdrawERC20(recipient)
       await reportBridgeBalances();
    }
    if (boolMessageTest == "1") {
      await communicationMessage();
    }
}  // main

main().then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

