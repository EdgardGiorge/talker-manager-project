module.exports = (req, res, next) => {
  const { email, password } = req.body;
  const validateEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  if ([email].includes(undefined)) {
      return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if ([password].includes(undefined)) {
      return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
      return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
      }
  if (!email.match(validateEmail)) {
      return res.status(400)
      .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  return next(); 
};