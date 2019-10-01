const SHA256 = require('crypto-js/sha256');

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp,transactions,previousHash=""){
        // this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.transactions) +
        this.nonce).toString();
    }
    
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty +1).join(0)){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('Block mined: '+this.hash)
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        // increasing difficulty increases time required to mine
        this.difficulty = 3;
        this.pendingTransactions =[];
        this.miningReward = 100;
    }
    
    createGenesisBlock(){
        return new Block("01/05/2019","Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty)
    //     this.chain.push(newBlock);
    // }

    // if mining is successful send the reward to address in parameter
    minePendingTransactions(miningRewardAddress){
        // in reality there are multiple pending transactions, and not all of them can be 
        //included, as block size cannot exceed 1 mb. Miners have to pick which transactions
        // to include. current program doesnt bother with this

        // the mining reward is added to pending transactions array. It will be sent to you,
        //  only when you mine the next mining block.
        // So reward for mining each block will be in next block mined
        let block = new Block(Date.now(),this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transactions(null,miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for(const block of this.chain){
            // block contains multiple transactions
            for(const trans of block.transactions){
                // transferred money from sender. sender address== your address.so balance deducted
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                // transferred money from sender. recvr addrss == your address so balance added from sender
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i =1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if (currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if (currentBlock.previousHash !== prevBlock.hash){
                return false;
            }
        }
        return true;
    }
}

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
blockChainObj.createTransaction(new Transactions('address1','address2',100));
blockChainObj.createTransaction(new Transactions('address2','address1',50));

console.log("\nStarting miner...")
blockChainObj.minePendingTransactions('SI adress');

console.log('\nBalance of SI is ',blockChainObj.getBalanceOfAddress('SI adress'));

console.log("\nStarting miner again...")
blockChainObj.minePendingTransactions('SI adress');

console.log('\nBalance of SI is ',blockChainObj.getBalanceOfAddress('SI adress'));