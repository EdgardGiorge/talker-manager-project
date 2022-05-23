const fs = require('fs');
const express = require('express');
const crypto = require('crypto');

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

routes.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;

      if ([email, password].includes(undefined)) {
          return res.status(401).json({});
      }
      const token = crypto.randomBytes(8).toString('hex');
      return res.status(200).json({ token });    
  } catch (error) {
      return res.status(400).end();
  } 
});

module.exports = routes;