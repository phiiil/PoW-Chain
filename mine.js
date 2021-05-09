const Block = require('./models/Block');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
const db = require('./db');
const TARGET_DIFFICULTY = BigInt("0x00000" + "F".repeat(59));
const BLOCK_REWARD = 10;


function startMining() {
  console.log(`🟢 ${process.env.MINER_NAME} Start Mining`);
  mining = true;
  mine();
}

function stopMining() {
  console.log(`🔴 ${process.env.MINER_NAME} Stop Mining`);
  mining = false;
}

function mine() {
  if (!mining) return;
  const block = new Block();

  // TODO: add transactions from the mempool

  const coinbaseUTXO = new UTXO(process.env.PUBLIC_KEY, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);
  while (BigInt('0x' + block.hash()) >= TARGET_DIFFICULTY) {
    block.nonce++;
  }
  block.execute();
  db.blockchain.addBlock(block);
  console.log(`⛏️ ${process.env.MINER_NAME} mined block #${db.blockchain.blockHeight()} with a hash of ${block.hash()} at nonce ${block.nonce}`);
  setTimeout(mine, 100);
}

module.exports = {
  startMining,
  stopMining,
};
