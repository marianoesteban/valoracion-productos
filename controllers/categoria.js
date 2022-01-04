const validator = require('validator');
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

/**
 * GET /categorias/agregar
 * Página para agregar una nueva categoría.
 */
exports.getAddCategoria = (req, res) => {
  res.render('categoria/new', {
    title: 'Agregar categoría'
  });
};

/**
 * POST /categorias/agregar
 * Crear una nueva categoría.
 */
exports.postAddCategoria = async (req, res, next) => {
  if (validator.isEmpty(req.body.nombre, { ignore_whitespace: true })) {
    req.flash('errors', { msg: 'Debe especificar el nombre de la categoría.' });
    return res.redirect('/categorias/agregar');
  }

  const categoria = new Categoria({
    nombre: req.body.nombre
  });

  try {
    const existingCategoria = await Categoria.findOne({ nombre: req.body.nombre });
    if (existingCategoria) {
      req.flash('errors', { msg: 'Ya existe una categoría con ese nombre.' });
      return res.redirect('/categorias/agregar');
    }

    await categoria.save();
    req.flash('success', { msg: 'La categoría ha sido agregada exitosamente.'});
    res.redirect('/categorias');
  } catch (err) {
    next(err);
  }
};
