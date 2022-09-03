const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const TOKEN_SECURE = process.env.TOKEN;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, TOKEN_SECURE);
    const userId = decodedToken.userId;
    req.auth = { userId: userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable'
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !' });
  }
};