const Categoria = require('../models/Categoria');

/**
 * GET /categorias
 * Página de administración de categorías.
 */
exports.getCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.find({}).sort('nombre');
    res.render('categoria/list', {
      title: 'Categorías',
      categorias
    });
  } catch (err) {
    next(err);
  }
};
