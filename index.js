// argument config is a number
// exmaple: node index.js --config=1
const { argv } = require('yargs');
console.log(argv);
const { config } = argv;
console.log(`🚀 Starting miner with config #${config}`);
const result = require('dotenv').config({ path: `.env${config}` });
process.env.MINER_NAME = process.env.PUBLIC_KEY.slice(0, 4).toUpperCase();
console.log(`👋 Hello miners, my name is ${process.env.MINER_NAME} on port ${process.env.PORT}.`);
// express
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
// local dependencies
const { startMining, stopMining } = require('./mine');
const { utxos, blockchain } = require('./db');

app.post('/', (req, res) => {
  const { method, params } = req.body;
  if (method === 'startMining') {
    console.log('Start Mining');
    startMining();
    res.send({ blockNumber: blockchain.blockHeight() });
    return;
  }
  if (method === 'stopMining') {
    console.log('Stop Mining');
    stopMining();
    res.send({ blockNumber: blockchain.blockHeight() });
    return;
  }
  if (method === "getBalance") {
    const [address] = params;
    const ourUTXOs = utxos.filter(x => {
      return x.owner === address && !x.spent;
    });
    const sum = ourUTXOs.reduce((p, c) => p + c.amount, 0);
    res.send({ balance: sum.toString() });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`👂 Listening on port ${process.env.PORT}`);
  startMining();
});
