const Producto = require('../models/Producto');

/**
 * GET /
 * Página de inicio.
 */
exports.index = async (req, res, next) => {
  try {
    const productos = await Producto.find({})
      .populate('categoria')
      .populate('marca')

    res.render('home', {
      title: 'Inicio',
      productos
    });
  } catch (err) {
    next(err);
  }
};
