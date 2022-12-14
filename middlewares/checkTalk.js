const format = /^\d{2}\/\d{2}\/\d{4}$/;

const objectOk = (talk) => {
  if (!talk || !('rate' in talk) || !('watchedAt' in talk)) {
    return true;
  } 

  return false;
};
module.exports = (req, res, next) => {
  const { talk } = req.body;  
  if (objectOk(talk)) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }
  if (!format.test(talk.watchedAt)) {
    return res.status(400).json({
       message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
     });
  }    
  if (talk.rate < 1 || talk.rate > 5) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
  }
  
  next();
};