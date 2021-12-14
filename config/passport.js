const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Iniciar sesión con e-mail y contraseña.
 */
 passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
   User.findOne({ username: username.toLowerCase() }, (err, user) => {
     if (err) return done(err);
     if (!user) {
       return done(null, false, { msg: `El usuario ${username} no existe en el sistema.` });
     }
     user.verifyPassword(password, (err, isMatch) => {
       if (err) return done(err);
       if (isMatch) {
         return done(null, user);
       }
       return done(null, false, { msg: 'El usuario o la contraseña son incorrectos.' });
     });
   });
 }));
