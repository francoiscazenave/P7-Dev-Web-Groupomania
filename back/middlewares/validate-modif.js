const { body } = require('express-validator');

const modifSchema = [
  body('post.*.title').if(body('post.*.title').exists({ checkFalsy: true})).notEmpty().trim().isAlphanumeric(),
  body('post.*.text').if(body('post.*.text').exists({ checkFalsy: true})).notEmpty().trim().isAlphanumeric(),
];

module.exports = modifSchema;