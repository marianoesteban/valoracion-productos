const passport = require('passport');
const validator = require('validator');

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
