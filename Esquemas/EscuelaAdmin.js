const mongoose = require('mongoose')
const { Schema } = mongoose

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
})

const EsquemaEscuelaAdmin = new Schema({
    clave: String,
    nombre: String,
    direccion: String,
    ciudad: String,
    administrativos:[EsquemaAdministrativo]
})

const ModelEscuelaAdmin = mongoose.model('EscuelaAdmin', EsquemaEscuelaAdmin)
module.exports = ModelEscuelaAdmin