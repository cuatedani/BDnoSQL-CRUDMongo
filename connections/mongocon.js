const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/GestionEscolar'
//const uri = 'mongodb+srv://sa:12345@cluster0.0ifpfe7.mongodb.net/GestionEscolar?retryWrites=true&w=majority'

module.exports = () => mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology: true});

