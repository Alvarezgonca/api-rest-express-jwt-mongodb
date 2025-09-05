
// =========================
// Imports e configuração
// =========================
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/api');

// Variáveis de ambiente para JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// =========================
// Modelos
// =========================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
const Todo = mongoose.model('Todo', todoSchema);

// =========================
// Middlewares
// =========================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não enviado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // payload contém userId e email
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

// =========================
// Rotas de autenticação
// =========================

// Registro de novo usuário
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha name, email e password' });
  }
  try {
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash });
    await user.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Login do usuário
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Preencha email e password' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }
    // Gerar tokens
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      accessToken,
      refreshToken,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Gera novo accessToken a partir do refreshToken
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token não enviado' });
  }
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { userId: payload.userId, email: payload.email },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    const newRefreshToken = jwt.sign(
      { userId: payload.userId, email: payload.email },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ error: 'Refresh token inválido ou expirado' });
  }
});

// =========================
// Rotas protegidas (usuário e todos)
// =========================

// Retorna dados do usuário autenticado
app.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Cria uma nova tarefa (todo)
app.post('/todos', authMiddleware, async (req, res) => {
  const { title, done } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'O campo title é obrigatório' });
  }
  try {
    const todo = new Todo({
      title,
      done: done || false,
      owner: req.user.userId
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

// Lista todas as tarefas do usuário autenticado
app.get('/todos', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ owner: req.user.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

// Busca uma tarefa específica do usuário
app.get('/todos/:id', authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!todo) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
});

// Atualiza uma tarefa do usuário
app.put('/todos/:id', authMiddleware, async (req, res) => {
  const { title, done } = req.body;
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { title, done },
      { new: true, runValidators: true }
    );
    if (!todo) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// Remove uma tarefa do usuário
app.delete('/todos/:id', authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!todo) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json({ message: 'Tarefa removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover tarefa' });
  }
});

// =========================
// Inicialização do servidor
// =========================
app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});