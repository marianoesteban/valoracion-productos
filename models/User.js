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
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
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
