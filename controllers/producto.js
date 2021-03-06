const fsPromises = require('fs').promises;
const path = require('path');
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

  try {
    let imagen = undefined;
    if (req.file) {
      imagen = {
        data: await fsPromises.readFile(req.file.path),
        mediaType: req.file.mimetype
      };
    }

    const producto = new Producto({
      imagen,
      categoria: req.body.categoria,
      marca: req.body.marca,
      modelo: req.body.modelo,
    });

    await producto.save();
    req.flash('success', { msg: 'El producto ha sido agregado exitosamente.' });
    res.redirect('/productos');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /productos/editar/:idProducto
 * Página para editar los datos de un producto.
 */
exports.getEditProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.idProducto);
    if (!producto) {
      req.flash('errors', { msg: 'No se encuentra el producto.' });
      return res.redirect('/productos');
    }

    const categorias = await Categoria.find({}).sort('nombre');
    const marcas = await Marca.find({}).sort('nombre');

    res.render('producto/edit', {
      title: 'Editar producto',
      producto,
      categorias,
      marcas
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /productos/editar/:idProducto
 * Editar los datos de un producto.
 */
exports.postEditProducto = async (req, res, next) => {
  if (validator.isEmpty(req.body.modelo, { ignore_whitespace: true })) {
    req.flash('errors', { msg: 'Debe especificar el modelo del producto.' });
    return res.redirect('/productos/editar/' + req.params.idProducto);
  }

  try {
    let imagen = undefined;
    if (req.file) {
      imagen = {
        data: await fsPromises.readFile(req.file.path),
        mediaType: req.file.mimetype
      };
    }

    await Producto.updateOne({ _id: req.params.idProducto }, {
      imagen,
      categoria: req.body.categoria,
      marca: req.body.marca,
      modelo: req.body.modelo
    });
    req.flash('success', { msg: 'El producto ha sido editado exitosamente.' });
    res.redirect('/productos');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /productos/eliminar/:idProducto
 * Elimina el producto especificado.
 */
exports.deleteProducto = async (req, res, next) => {
  try {
    await Producto.deleteOne({ _id: req.params.idProducto });
    req.flash('success', { msg: 'El producto ha sido eliminado exitosamente.' });
    res.redirect('/productos');
  } catch (err) {
    next(err);
  }
};
