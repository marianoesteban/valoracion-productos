const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  imagen: {
    data: Buffer,
    mediaType: String
  },
  categoria: { type: mongoose.Schema.Types.ObjectID, ref: 'Categoria' },
  marca: { type: mongoose.Schema.Types.ObjectID, ref: 'Marca' },
  modelo: String,
  valoraciones: [
    {
      user: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true },
      fechaCreacion: Date,
      calificacion: { type: Number, min: 1, max: 10, required: true },
      opinion: String
    }
  ],
  sumaCalificaciones: { type: Number, default: 0 },
  numCalificaciones: { type: Number, default: 0 }
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
