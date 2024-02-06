const mongoose = require('mongoose');
const { Schema } = mongoose;

const EsquemaEscuela = new Schema({
    clave: String,
    nombre: String,
    direccion: String,
    ciudad: String
});

const ModelEscuela = mongoose.model('Escuela', EsquemaEscuela)
module.exports = ModelEscuela