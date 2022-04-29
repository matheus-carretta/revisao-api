const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();

app.use(bodyParser.json());

app.get('/produtos', async (_req, res) => {
  const produtos = await fs.readFile('./produtos.json');
  return res.status(200).json(JSON.parse(produtos));
})

app.listen('3001', () => {
  console.log('Servidor rodando');
})