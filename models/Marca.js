const mongoose = require('mongoose');

const marcaSchema = new mongoose.Schema({
  nombre: { type: String, unique: true }
});

const Marca = mongoose.model('Marca', marcaSchema);

module.exports = Marca;
