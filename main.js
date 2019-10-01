const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index,timestamp,data,previousHash=""){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) +
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
        this.difficulty = 5;
    }
    
    createGenesisBlock(){
        return new Block(0,"01/05/2019","Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock);
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
// blockChainObj.addBlock(new Block(1,"02/05/2019",{sender:"SBI", receiver: "Customer1", amt: "1456"}));
// blockChainObj.addBlock(new Block(2,"03/05/2019",{sender:"CBI", receiver: "Customer2", amt: "458"}));
// blockChainObj.addBlock(new Block(3,"04/05/2019",{sender:"HDFC", receiver: "Customer3", amt: "7000"}));

// console.log('Is blockchain valid ?', blockChainObj.isChainValid());

// // tampering with blockchain
// blockChainObj.chain[2].data = {sender:"CBI", receiver: "Customer2", amt: "80000000"}
// console.log('Is blockchain valid ?', blockChainObj.isChainValid());

// // second tampering on same block with hash recalculation
// blockChainObj.chain[2].data = {sender:"CBI", receiver: "Customer2", amt: "90000000"}
// blockChainObj.chain[2].hash = blockChainObj.chain[2].calculateHash();
// console.log('Is blockchain valid ?', blockChainObj.isChainValid());
// // console.log(JSON.stringify(blockChainObj, null, 5));

console.log('Mining block 1');
blockChainObj.addBlock(new Block(1,"02/05/2019",{sender:"SBI", receiver: "Customer1", amt: "1456"}));

console.log('Mining block 2');
blockChainObj.addBlock(new Block(2,"03/05/2019",{sender:"CBI", receiver: "Customer2", amt: "458"}));