const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {BlockChain, Transactions} = require('./blockchain');
const myKey = ec.keyFromPrivate('0b8d7aa049915dd80d9e9f2d720fe7a7ab0021c0611447aa9f023b0d9734b5f8');
const myWalletAddress = myKey.getPublic('hex');


let blockChainObj = new BlockChain();
//implementation 1
// blockChainObj.addBlock(new Block(1,"02/05/2019",{sender:"SBI", receiver: "Customer1", amt: "1456"}));
// blockChainObj.addBlock(new Block(2,"03/05/2019",{sender:"CBI", receiver: "Customer2", amt: "458"}));
// blockChainObj.addBlock(new Block(3,"04/05/2019",{sender:"HDFC", receiver: "Customer3", amt: "7000"}));

// console.log('Is blockchain valid ?', blockChainObj.isChainValid());

// // tampering with blockchain
// blockChainObj.chain[2].transactions = {sender:"CBI", receiver: "Customer2", amt: "80000000"}
// console.log('Is blockchain valid ?', blockChainObj.isChainValid());

// // second tampering on same block with hash recalculation
// blockChainObj.chain[2].transactions = {sender:"CBI", receiver: "Customer2", amt: "90000000"}
// blockChainObj.chain[2].hash = blockChainObj.chain[2].calculateHash();
// console.log('Is blockchain valid ?', blockChainObj.isChainValid());
// // console.log(JSON.stringify(blockChainObj, null, 5));



// implementation 2
// console.log('Mining block 1');
// blockChainObj.addBlock(new Block("02/05/2019",{sender:"SBI", receiver: "Customer1", amt: "1456"}));

// console.log('Mining block 2');
// blockChainObj.addBlock(new Block("03/05/2019",{sender:"CBI", receiver: "Customer2", amt: "458"}));



// implementation 3
// blockChainObj.createTransaction(new Transactions('address1','address2',100));
// blockChainObj.createTransaction(new Transactions('address2','address1',50));

// console.log("\nStarting miner...")
// blockChainObj.minePendingTransactions('SI adress');

// console.log('\nBalance of SI is ',blockChainObj.getBalanceOfAddress('SI adress'));

// console.log("\nStarting miner again...")
// blockChainObj.minePendingTransactions('SI adress');

// console.log('\nBalance of SI is ',blockChainObj.getBalanceOfAddress('SI adress'));

// implementation 4
const tx1 = new Transactions(myWalletAddress,'public key goes here',10);
tx1.signTransaction(myKey);
blockChainObj.addTransaction(tx1);

console.log("\nStarting miner...")
blockChainObj.minePendingTransactions(myWalletAddress);

// const tx2 = new Transactions(myWalletAddress,'public key goes here_1',50);
// tx2.signTransaction(myKey);
// blockChainObj.addTransaction(tx2);

// console.log("\nStarting miner again...")
// blockChainObj.minePendingTransactions(myWalletAddress);

console.log('\nBalance of SI is ',blockChainObj.getBalanceOfAddress(myWalletAddress));

// tampering
blockChainObj.chain[1].transactions[0].amount = 1;

console.log('Is chain valid? : '+blockChainObj.isChainValid())