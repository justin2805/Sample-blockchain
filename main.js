const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index,timestamp,data,previousHash=""){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }
    
    createGenesisBlock(){
        return new Block(0,"01/05/2019","Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
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
blockChainObj.addBlock(new Block(1,"02/05/2019",{sender:"SBI", receiver: "Customer1", amt: "1456"}));
blockChainObj.addBlock(new Block(2,"03/05/2019",{sender:"CBI", receiver: "Customer2", amt: "458"}));
blockChainObj.addBlock(new Block(3,"04/05/2019",{sender:"HDFC", receiver: "Customer3", amt: "7000"}));

console.log('Is blockchain valid ?', blockChainObj.isChainValid());

// tampering with blockchain
blockChainObj.chain[2].data = {sender:"CBI", receiver: "Customer2", amt: "80000000"}
console.log('Is blockchain valid ?', blockChainObj.isChainValid());

// second tampering on same block with hash recalculation
blockChainObj.chain[2].data = {sender:"CBI", receiver: "Customer2", amt: "90000000"}
blockChainObj.chain[2].hash = blockChainObj.chain[2].calculateHash();
console.log('Is blockchain valid ?', blockChainObj.isChainValid());
// console.log(JSON.stringify(blockChainObj, null, 5));