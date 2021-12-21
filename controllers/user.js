const passport = require('passport');
const validator = require('validator');
const User = require('../models/User');

/**
 * GET /iniciar-sesion
 * Página de inicio de sesión.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Iniciar sesión'
  });
};

/**
 * POST /iniciar-sesion
 * Iniciar sesión.
 */
exports.postLogin = (req, res, next) => {
  if (validator.isEmpty(req.body.password)) {
    req.flash('errors', { msg: 'Debe ingresar la contraseña.' });
    return res.redirect('/iniciar-sesion');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/iniciar-sesion');
    }
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash('success', { msg: 'La sesión ha sido iniciada exitosamente.' });
      res.redirect('/');
    });
  })(req, res, next);
}

/**
 * GET /cerrar-sesion
 * Cerrar sesión.
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * GET /registro
 * Página de registro de usuarios.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Registro'
  });
};

/**
 * POST /registro
 * Crear una nueva cuenta de usuario.
 */
exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isLength(req.body.password, { min: 6 })) {
    validationErrors.push({ msg: 'La contraseña debe tener al menos 6 caracteres.' });
  }
  if (req.body.password !== req.body.confirmPassword) {
    validationErrors.push({ msg: 'Las contraseñas no coinciden.' });
  }

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/registro');
  }

  const user = new User({
    username: req.body.username,
    password: req.body.password,
    role: 'user'
  });

  User.findOne({ username: req.body.username }, (err, existingUser) => {
    if (err) return next(err);

    if (existingUser) {
      req.flash('errors', { msg: 'Ya existe un usuario con ese nombre.' });
      return res.redirect('/registro');
    }

    User.countDocuments({}, (err, count) => {
      if (err) return next(err);

      // el primer usuario registrado es el administrador
      if (count === 0)
        user.role = 'admin';

      user.save((err) => {
        if (err) return next(err);
        req.login(user, (err) => {
          if (err) return next(err);
          req.flash('success', { msg: 'El usuario ha sido registrado exitosamente.' });
          if (user.role === 'admin')
            req.flash('success', { msg: 'Al ser el primer usuario registrado, se te han otorgado permisos de administrador.' });
          res.redirect('/');
        });
      });
    });
  });
};
