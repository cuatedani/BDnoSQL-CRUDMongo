const mongoose = require('mongoose');
const { Schema } = mongoose;

const EsquemaAlumno = new Schema({
    curp:String,
    tutor:String,
    inscripcion:{escuelaclave:String, fechainscripcion:String},
    nombre:String,
    fechanac:String
});

const ModelAlumno = mongoose.model('Alumno', EsquemaAlumno)

module.exports = ModelAlumno