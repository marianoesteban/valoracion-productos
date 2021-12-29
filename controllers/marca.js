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
