const { body } = require('express-validator');

const loginSchema = [
  /* 
  vérification que l'email est présent et qu'il est valide
  normalizeEmail() est un sanitizer
  */
  body('email').trim().isEmail().normalizeEmail().toLowerCase(),
  /* 
  vérification que le mot de passe fait au minimum 5 caractère.
  */
  body('password').trim().isLength(5),
];

module.exports = loginSchema;