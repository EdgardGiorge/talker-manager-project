const fs = require('fs');
const express = require('express');

const routes = express.Router();

routes.get('/talker', (req, res) => {
  const rDados = fs.readFileSync('talker.json'); // pra leitura de métodos síncronos, rota de dados
  const talk = JSON.parse(rDados); // facilitar extração futura de chave e valor puro  

  res.status(200).json(talk);
});

module.exports = routes;