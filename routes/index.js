const fs = require('fs');
const express = require('express');
const crypto = require('crypto');
const middlewares = require('../middlewares');

const routes = express.Router();

routes.get('/talker', (req, res) => {
  const rDados = fs.readFileSync('talker.json'); // pra leitura de métodos síncronos, rota de dados
  const talk = JSON.parse(rDados); // facilitar extração futura de chave e valor puro  

  res.status(200).json(talk);
});

routes.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const rDados = fs.readFileSync('talker.json');
  const talker = JSON.parse(rDados);

  const talkUser = talker.find((t) => t.id === parseInt(id, 5));
  if (!talkUser) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(talkUser);
});

routes.post('/login', middlewares.checkAuth, (req, res) => {  
  const token = crypto.randomBytes(8).toString('hex');
  
  return res.status(200).json({ token });
});

module.exports = routes;