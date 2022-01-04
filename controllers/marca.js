const validator = require('validator');
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

/**
 * GET /marcas/agregar
 * Página para agregar una nueva marca.
 */
exports.getAddMarca = (req, res) => {
  res.render('marca/new', {
    title: 'Agregar marca'
  });
};

/**
 * POST /marcas/agregar
 * Crear una nueva marca.
 */
exports.postAddMarca = async (req, res, next) => {
  if (validator.isEmpty(req.body.nombre, { ignore_whitespace: true })) {
    req.flash('errors', { msg: 'Debe especificar el nombre de la marca.' });
    return res.redirect('/marcas/agregar');
  }

  const marca = new Marca({
    nombre: req.body.nombre
  });

  try {
    const existingMarca = await Marca.findOne({ nombre: req.body.nombre });
    if (existingMarca) {
      req.flash('errors', { msg: 'Ya existe una marca con ese nombre.' });
      return res.redirect('/marcas/agregar');
    }

    await marca.save();
    req.flash('success', { msg: 'La marca ha sido agregada exitosamente.'});
    res.redirect('/marcas');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /marcas/editar/:idMarca
 * Página para editar los datos de una marca.
 */
exports.getEditMarca = async (req, res, next) => {
  try {
    const marca = await Marca.findById(req.params.idMarca);
    if (!marca) {
      req.flash('errors', { msg: 'No se encuentra la marca.' });
      return res.redirect('/marcas');
    }

    res.render('marca/edit', {
      title: 'Editar marca',
      marca
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /marcas/editar/:idMarca
 * Editar los datos de una marca.
 */
exports.postEditMarca = async (req, res, next) => {
  if (validator.isEmpty(req.body.nombre, { ignore_whitespace: true })) {
    req.flash('errors', { msg: 'Debe especificar el nombre de la marca.' });
    return res.redirect('/marcas/agregar');
  }

  try {
    await Marca.updateOne({ _id: req.params.idMarca }, { nombre: req.body.nombre });
    req.flash('success', { msg: 'La marca ha sido editada exitosamente.' });
    res.redirect('/marcas');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /marcas/eliminar/:idMarca
 * Elimina la marca especificada.
 */
exports.deleteMarca = async (req, res, next) => {
  try {
    await Marca.deleteOne({ _id: req.params.idMarca });
    req.flash('success', { msg: 'La marca ha sido eliminada exitosamente.' });
    res.redirect('/marcas');
  } catch (err) {
    next(err);
  }
};
