const Producto = require('../models/Producto');

/**
 * GET /valoraciones/:idProducto
 * Página de valoraciones de un producto.
 */
exports.getValoraciones = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.idProducto)
      .populate('categoria')
      .populate('marca');

    res.render('valoracion/details', {
      title: `${producto.marca.nombre} ${producto.modelo}`,
      producto
    });
  } catch (err) {
    next(err);
  }
};
