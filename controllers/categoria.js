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

/**
 * GET /categorias/editar/:idCategoria
 * Página para editar los datos de una categoría.
 */
exports.getEditCategoria = async (req, res, next) => {
  try {
    const categoria = await Categoria.findById(req.params.idCategoria);
    if (!categoria) {
      req.flash('errors', { msg: 'No se encuentra la categoría.' });
      return res.redirect('/categorias');
    }

    res.render('categoria/edit', {
      title: 'Editar categoría',
      categoria
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /categorias/editar/:idCategoria
 * Editar los datos de una categoría.
 */
exports.postEditCategoria = async (req, res, next) => {
  if (validator.isEmpty(req.body.nombre, { ignore_whitespace: true })) {
    req.flash('errors', { msg: 'Debe especificar el nombre de la categoría.' });
    return res.redirect('/categorias/editar/' + req.params.idCategoria);
  }

  try {
    await Categoria.updateOne({ _id: req.params.idCategoria }, { nombre: req.body.nombre });
    req.flash('success', { msg: 'La categoría ha sido editada exitosamente.' });
    res.redirect('/categorias');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /categorias/eliminar/:idCategoria
 * Elimina la categoría especificada.
 */
exports.deleteCategoria = async (req, res, next) => {
  try {
    await Categoria.deleteOne({ _id: req.params.idCategoria });
    req.flash('success', { msg: 'La categoría ha sido eliminada exitosamente.' });
    res.redirect('/categorias');
  } catch (err) {
    next(err);
  }
};
