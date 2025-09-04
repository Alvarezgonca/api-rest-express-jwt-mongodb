const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Permite receber JSON

// Conexão com o MongoDB (ajuste a string se usar Docker)
mongoose.connect('mongodb://localhost:27017/minhaapi');

// Modelo simples
const Item = mongoose.model('Item', { nome: String });

// Rota para criar um item
app.post('/items', async (req, res) => {
  const item = new Item({ nome: req.body.nome });
  await item.save();
  res.json(item);
});

// Rota para listar todos os itens
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});