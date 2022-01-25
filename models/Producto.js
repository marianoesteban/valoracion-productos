const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  imagen: String,
  categoria: { type: mongoose.Schema.Types.ObjectID, ref: 'Categoria' },
  marca: { type: mongoose.Schema.Types.ObjectID, ref: 'Marca' },
  modelo: String
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
