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

// Ref. Agradecimento aos colegas que me ajudaram a entender que o search era pra utilizar apenas a letra q
routes.get('/talker/search', middlewares.checkToken, (req, res) => {
  const { q } = req.query; // usar a propriedade query onde contém os dados, pesquisar se existe pessoas usuárias com o nome da req.
  const rDados = fs.readFileSync(talkerJson);
  const talker = JSON.parse(rDados);
  if (q === undefined || q === '') return res.status(200).json(talker); // Caso não tenha o q pesquisado, retornar status 400 e a msg
  const users = talker.filter((user) => user.name.toLowerCase().includes(q.toLocaleLowerCase())); // Se existir o q, buscar e filtrar no banco procurar por name
  
  if (!users) return res.status(404).json({ message: 'User Not Found' });     
  
  res.status(200).json(users);
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
  
  const object = {
    id: talker.length + 1,
    name,
    age,
    talk: { watchedAt, rate },
  };

  talker.push(object);
  const objTalk = JSON.stringify(talker);
  fs.writeFileSync(talkerJson, objTalk);
  return res.status(201).json(object);
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
  const changeTalk = [...talker, talker[tUser]];
  fs.writeFileSync(talkerJson, JSON.stringify(changeTalk));
  return res.status(200).json(changeTalk[tUser]);  
});

routes.delete('/talker/:id', (req, res) => {
  const { id } = req.params;
  const rDados = fs.readFileSync(talkerJson);
  const talker = JSON.parse(rDados);
  const tUser = talker.findIndex((index) => index.id === Number(id));
  talker.splice(tUser, 1);  

  const object = JSON.stringify(talker);
  fs.writeFileSync(talkerJson, object);
  
  res.status(204).end();
});

module.exports = routes;