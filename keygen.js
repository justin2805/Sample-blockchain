const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');
// only the creator of the keys will be able to do transactions for his/her wallet
console.log();
console.log('Public key: '+publicKey);
console.log();
console.log('Private key: '+privateKey);