const { body } = require('express-validator');

 const createSchema = [
  body('post.*.title').not().isEmpty().isAlphanumeric('fr-FR').trim(),
  body('post.*.text').not().isEmpty().isAlphanumeric('fr-FR').trim(),
];

module.exports = createSchema;