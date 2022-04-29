const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();

// helpers
async function readProdutos() {
  const produtos = await fs.readFile('./produtos.json');
  return JSON.parse(produtos);
}

async function writeProducts(content) {
  return await fs.writeFile('./produtos.json', JSON.stringify(content, null, 2), 'utf-8');
}

app.use(bodyParser.json());

const verifyAuth = (req, res, next) => {
  const { token } = req.headers;

  if(!token) return res.status(400).json({message: 'Token inválido'});

  if(!(token === 'abcdef')) return res.status(400).json({message: 'Token inválido'});

  next();

}

app.get('/produtos', async (_req, res) => {
  const produtos = await readProdutos();
  return res.status(200).json(produtos);
})

app.get('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const produtos = await readProdutos();
  const produto = produtos.find((produto) => produto.id === Number(id));
  return res.status(200).json(produto);
})

app.post('/produtos', verifyAuth, async (req, res) => {
  const novoProduto = req.body;
  const produtos = await readProdutos();
  produtos.push(novoProduto);

  await writeProducts(produtos);

  return res.status(200).json(novoProduto);
})

app.put('/produtos/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;
  const content = req.body;

  const produtos = await readProdutos();
  const numberId = +id;

  const productIndex = produtos.findIndex((produto) => produto.id === numberId);
  produtos.splice(productIndex, 1, content);

  await writeProducts(produtos);

  return res.status(200).json(content);

})

app.delete('/produtos/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;
  const produtos = await readProdutos();

  const produtosFiltrados = produtos.filter((produto) => produto.id !== +id);

  await writeProducts(produtosFiltrados);

  return res.status(200).json({ message: 'Produto deletado com sucesso!'})
})

app.listen('3001', () => {
  console.log('Servidor rodando');
})