const mongoose = require('mongoose');
const { Schema } = mongoose;

const EsquemaMantenimiento = new Schema({
    curp: String,
    escuelaclave: String,
    nombre: String,
    telefono: String,
    cuenta: String,
    telefonoinst:String,
    area:String
});

const ModelMantenimiento = mongoose.model('Mantenimiento', EsquemaMantenimiento)

module.exports = ModelMantenimiento