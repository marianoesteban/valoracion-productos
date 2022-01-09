const Producto = require('../models/Producto');

/**
 * GET /productos
 * Página de administración de productos.
 */
exports.getProductos = async (req, res, next) => {
  try {
    const productos = await Producto.aggregate([
      { $match: {} },
      { $lookup: { from: 'categorias', localField: 'categoria', foreignField: '_id', as: 'categoria' } },
      { $unwind: '$categoria' },
      { $lookup: { from: 'marcas', localField: 'marca', foreignField: '_id', as: 'marca' } },
      { $unwind: '$marca' },
      { $sort: { 'categoria.nombre': 1, 'marca.nombre': 1, 'modelo': 1 } }
    ]);

    res.render('producto/list', {
      title: 'Productos',
      productos
    });
  } catch (err) {
    next(err);
  }
};
