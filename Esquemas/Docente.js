const mongoose = require('mongoose');
const { Schema } = mongoose;

const EsquemaDocente = new Schema({
    curp: String,
    escuelaclave: String,
    nombre: String,
    telefono: String,
    cuenta: String,
    oficina: String,
    especialidad: String,
    grado: String
});

const ModelDocente = mongoose.model('Docente', EsquemaDocente)

module.exports = ModelDocente