const validator = require('validator');
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

    if (!producto) {
      req.flash('errors', { msg: 'No se encuentra el producto.' });
      return res.redirect('back');
    }

    res.render('valoracion/details', {
      title: `${producto.marca.nombre} ${producto.modelo}`,
      producto
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /valoraciones/:idProducto
 * Agrega una nueva valoración para un producto.
 */
exports.postValoracion = async (req, res, next) => {
  if (!validator.isInt(req.body.calificacion, { min: 1, max: 10 })) {
    req.flash('errors', { msg: 'Debe especificar una calificación entre 1 y 10.' });
    return res.redirect('back');
  }

  try {
    const producto = await Producto.findById(req.params.idProducto);

    // chequear que el producto exista
    if (!producto) {
      req.flash('errors', { msg: 'No se encuentra el producto.' });
      return res.redirect('/');
    }

    // chequear que el usuario todavía no haya valorado el producto
    if (producto.valoraciones.some(valoracion => valoracion.user.toString() === req.user._id.toString())) {
      req.flash('errors', { msg: 'Ya ha valorado este producto.' });
      return res.redirect('back');
    }

    // agregar la valoración y actualizar los datos de las valoraciones
    const calificacion = validator.toInt(req.body.calificacion);
    producto.valoraciones.push({
      user: req.user,
      fechaCreacion: new Date(),
      calificacion: calificacion,
      opinion: req.body.opinion
    });
    producto.sumaCalificaciones += calificacion;
    producto.numCalificaciones++;

    await producto.save();

    req.flash('success', { msg: 'La valoración ha sido agregada exitosamente.' });
    res.redirect('back');
  } catch (err) {
    next(err);
  }
};
