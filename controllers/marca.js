const Marca = require('../models/Marca');

/**
 * GET /marcas
 * Página de administración de marcas.
 */
exports.getMarcas = async (req, res, next) => {
  try {
    const marcas = await Marca.find({}).sort('nombre');
    res.render('marca/list', {
      title: 'Marcas',
      marcas
    });
  } catch (err) {
    next(err);
  }
};
