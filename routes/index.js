const fs = require('fs');
const express = require('express');
const crypto = require('crypto');
const middlewares = require('../middlewares');

const routes = express.Router();

const talkerJson = ('talker.json');

routes.get('/talker', (req, res) => {
  const rDados = fs.readFileSync(talkerJson); // pra leitura de métodos síncronos, rota de dados
  const talk = JSON.parse(rDados); // facilitar extração futura de chave e valor puro  

  res.status(200).json(talk);
});

routes.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const rDados = fs.readFileSync(talkerJson);
  const talker = JSON.parse(rDados);

  const talkUser = talker.find((t) => t.id === parseInt(id, 5));
  if (!talkUser) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(talkUser);
});

routes.post('/login', middlewares.checkAuth, (req, res) => {  
  const token = crypto.randomBytes(8).toString('hex');
  
  return res.status(200).json({ token });
});

routes.use(middlewares.checkToken);

routes.post('/talker', 
middlewares.checkName, 
middlewares.checkAge, 
middlewares.checkTalk, 
middlewares.checkRate, 
(req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const rDados = fs.readFileSync(talkerJson);
  const talker = JSON.parse(rDados);
  
  const obj = {
    id: talker.length + 1,
    name,
    age,
    talk: { watchedAt, rate },
  };

  const addTalkers = [];
  addTalkers.push(obj);
  const objTalk = JSON.stringify(addTalkers);
  fs.writeFileSync(talkerJson, objTalk);
  return res.status(201).json(obj);
});

routes.put('/talker/:id', 
middlewares.checkName, 
middlewares.checkAge, 
middlewares.checkTalk, 
(req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;

  const rDados = fs.readFileSync(talkerJson);
  const talker = JSON.parse(rDados);
  const tUser = talker.findIndex((i) => i.id === Number(id));
  talker[tUser].name = name;
  talker[tUser].age = age;
  talker[tUser].talk.watchedAt = talk.watchedAt;
  talker[tUser].talk.rate = talk.rate;
  // talker.splice(tUser, 1);
  const changeTalk = [...talker, talker[tUser]];
  fs.writeFileSync(talkerJson, JSON.stringify(changeTalk));
  return res.status(200).json(changeTalk[tUser]);  
});

module.exports = routes;