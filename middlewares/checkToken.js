module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const allHeaders = Object.keys(req.headers);

  if (!allHeaders.includes('authorization')) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization !== '' && authorization !== undefined && authorization.length === 16) {
    return next();
  }
  
  return res.status(401).json({ message: 'Token inválido' });
};