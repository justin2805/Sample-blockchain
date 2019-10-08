const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount+ this.timestamp).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64')
        this.signature = sig.toDER('hex');
    }

    isValid(){
        // if fromAddress is null
        if(this.fromAddress === null) return true;

        // if there is signature
        if(!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        // if there is signature, extract public key from it
        // and verify that transaction has been signed by that key
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
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

    hasValidTransaction(){
        // iterate over all transactions in the block
        for(const tx of this.transactions) {
            if(!tx.isValid()){
                return false;
            }
        }
        //  all transactions in the block are valiid
        return true;
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        // increasing difficulty increases time required to mine
        this.difficulty = 3;
        this.pendingTransactions =[];
        this.miningReward = 100;
        console.log('BC constr: this.miningReward : '+this.miningReward)
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
        const rewardTx = new Transactions(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }
        if (!transaction.isValid){
            throw new Error('Cannot add invalid transaction to chain')
        }
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

    // Goes over all the block in chain, verifies hashes are correct and each block links to prev block
    // verify all transactions in current block are valid
    isChainValid(){
        for(let i =1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransaction()){
                return false;
            }

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

module.exports.BlockChain = BlockChain;
module.exports.Transactions = Transactions;