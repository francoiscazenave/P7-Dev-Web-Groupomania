const mongoose = require('mongoose');
// package qui permet de ne pas créer plusieurs utilisateurs avec le même mail
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);