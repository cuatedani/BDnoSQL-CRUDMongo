const mongoose = require('mongoose');
const { Schema } = mongoose;

const EsquemaAdministrativo = new Schema({
    curp: String,
    escuelaclave: String,
    nombre: String,
    telefono: String,
    cuenta: String,
    funcion: String,
    horaentrada: String,
    horasalida: String,
    extensiontelefonica: String,
    correo: String
});

const ModelAdministrativo = mongoose.model('Administrativo', EsquemaAdministrativo)

module.exports = ModelAdministrativo