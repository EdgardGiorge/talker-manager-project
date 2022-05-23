const fs = require('fs');
const express = require('express');

const routes = express.Router();

routes.get('/talker', (req, res) => {
  const rDados = fs.readFileSync('talker.json'); // pra leitura de métodos síncronos, rota de dados
  const talk = JSON.parse(rDados); // facilitar extração futura de chave e valor puro  

  res.status(200).json(talk);
});

routes.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const rDados = fs.readFileSync('talker.json');
  const talk = JSON.parse(rDados);

  const talkUser = talk.find((talker) => talker.id === parseInt(id, 5));
  if (!talkUser) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(talkUser);
});

module.exports = routes;