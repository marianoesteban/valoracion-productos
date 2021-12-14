const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

/**
 * Verificar la contraseña de un usuario.
 */
 userSchema.methods.verifyPassword = function verifyPassword(candidatePassword, cb) {
   bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
     cb(err, isMatch);
   });
 };

const User = mongoose.model('User', userSchema);

module.exports = User;
