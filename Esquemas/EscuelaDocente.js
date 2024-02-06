const mongoose = require('mongoose')
const { Schema } = mongoose

const EsquemaDocente = new Schema({
    curp: String,
    escuelaclave: String,
    nombre: String,
    telefono: String,
    cuenta: String,
    oficina: String,
    especialidad: String,
    grado: String
})

const EsquemaEscuelaDocente = new Schema({
    clave: String,
    nombre: String,
    direccion: String,
    ciudad: String,
    docentes:[EsquemaDocente]
})

const ModelEscuelaDocente = mongoose.model('EscuelaDocente', EsquemaEscuelaDocente)
module.exports = ModelEscuelaDocente