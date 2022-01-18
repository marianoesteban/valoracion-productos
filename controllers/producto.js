const validator = require('validator');
const Categoria = require('../models/Categoria');
const Marca = require('../models/Marca');
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

/**
 * GET /productos/agregar
 * Página para agregar un nuevo producto.
 */
exports.getAddProducto = async (req, res, next) => {
  try {
    const categorias = await Categoria.find({}).sort('nombre');
    const marcas = await Marca.find({}).sort('nombre');
    res.render('producto/new', {
      title: 'Agregar producto',
      categorias,
      marcas
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /productos/agregar
 * Crear un nuevo producto.
 */
exports.postAddProducto = async (req, res, next) => {
  if (validator.isEmpty(req.body.modelo, { ignore_whitespace: true })) {
    req.flash('errors', { msg: 'Debe especificar el modelo del producto.' });
    return res.redirect('/productos/agregar');
  }

  const producto = new Producto({
    categoria: req.body.categoria,
    marca: req.body.marca,
    modelo: req.body.modelo
  });

  try {
    await producto.save();
    req.flash('success', { msg: 'El producto ha sido agregado exitosamente.' });
    res.redirect('/productos');
  } catch (err) {
    next(err);
  }
};
