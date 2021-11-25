/**
 * GET /
 * Página de inicio.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Inicio'
  });
};
