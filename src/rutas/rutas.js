const express = require('express')
const router = express.Router()
const redisclient = require('../../connections/rediscon')
const mongoclient = require('../../connections/mongocon')
const ModelEscuela = require('../../Esquemas/Escuela')
const ModelDocente = require('../../Esquemas/Docente')
const ModelAdministrativo = require('../../Esquemas/Administrativo')
const ModelMantenimiento = require('../../Esquemas/Mantenimiento')
const ModelAlumno = require('../../Esquemas/Alumno')
const ModelEscuelaDocente = require('../../Esquemas/EscuelaDocente')
const ModelEscuelaAdmin = require('../../Esquemas/EscuelaAdmin')

var hoy = new Date()
var fecha = hoy.getFullYear() + ":" + (hoy.getMonth() + 1) + ':' + hoy.getDate()
var hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds()
var key = fecha + ':' + hora

redisclient.connect()

router.get('/Escuela', async (req, res) => {
    try {
        await mongoclient()
        const datos = await ModelEscuela.find()
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.set(key, ope)

    } catch (err) {
        console.error(err)
    }

})

router.get('/Escuela/:clave', async (req, res) => {
    try {
        await mongoclient()
        const clave = req.params.clave.replace(":", "")
        const datos = await ModelEscuela.find({ "clave": clave })
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.set(key, ope)
    } catch (err) {
        console.error(err)
    }

})

router.post('/Escuela', async (req, res) => {
    try {
        await mongoclient()
        var objetoA = await new ModelEscuela()
        objetoA.clave = req.body.clave;
        objetoA.nombre = req.body.nombre;
        objetoA.direccion = req.body.direccion;
        objetoA.ciudad = req.body.ciudad;
        await ModelEscuela.insertMany([objetoA])

        var objetoB = await new ModelEscuelaDocente()
        objetoB.clave = req.body.clave;
        objetoB.nombre = req.body.nombre;
        objetoB.direccion = req.body.direccion;
        objetoB.ciudad = req.body.ciudad;
        await ModelEscuelaDocente.insertMany([objetoB])

        var objetoC = await new ModelEscuelaAdmin()
        objetoC.clave = req.body.clave;
        objetoC.nombre = req.body.nombre;
        objetoC.direccion = req.body.direccion;
        objetoC.ciudad = req.body.ciudad;
        await ModelEscuelaAdmin.insertMany([objetoC])

        const ope = req.method + " en " + req.url
        await redisclient.set(key, ope)

        res.json({ message: "documento guardado exitosamente" })
    } catch (err) {
        console.error(err)
    }
})

router.put('/Escuela/:clave', async (req, res) => {
    try {
        await mongoclient()
        clave = req.params.clave.replace(":", "")
        nombre = req.body.nombre
        direccion = req.body.direccion
        ciudad = req.body.ciudad
        await ModelEscuela.updateOne({ "clave": clave },
            {
                $set: {
                    "nombre": nombre,
                    "direccion": direccion,
                    "ciudad": ciudad
                }
            })
        await ModelEscuelaDocente.updateOne({ "clave": clave },
            {
                $set: {
                    "nombre": nombre,
                    "direccion": direccion,
                    "ciudad": ciudad
                }
            })
        await ModelEscuelaAdmin.updateOne({ "clave": clave },
            {
                $set: {
                    "nombre": nombre,
                    "direccion": direccion,
                    "ciudad": ciudad
                }
            })

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()

        res.json({ message: "documento actualizado exitosamente" })
    } catch (err) {
        console.error(err)
    }
})

router.get('/Docente', async (req, res) => {
    try {
        await mongoclient()
        const datos = await ModelDocente.find()
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()
    } catch (err) {
        console.error(err)
    }
})

router.get('/Docente/:curp', async (req, res) => {
    try {
        await mongoclient()
        const curp = req.params.curp.replace(":", "")
        const datos = await ModelDocente.find({ "curp": curp })
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()
    } catch (err) {
        console.error(err)
    }
})

router.post('/Docente', async (req, res) => {
    try {
        await mongoclient()
        var objeto = await new ModelDocente()
        objeto.curp = req.body.curp
        objeto.escuelaclave = req.body.escuelaclave
        objeto.nombre = req.body.nombre
        objeto.telefono = req.body.telefono
        objeto.cuenta = req.body.cuenta
        objeto.oficina = req.body.oficina
        objeto.especialidad = req.body.especialidad
        objeto.grado = req.body.grado
        await ModelDocente.insertMany([objeto])
        await ModelEscuelaDocente.updateOne(
            { "clave": req.body.escuelaclave },
            {
                $push: {
                    "docentes": objeto
                }
            }
        )

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()

        res.json({ message: "documento guardado exitosamente" })
    } catch (err) {
        console.error(err)
    }
})

router.put('/Docente/:curp', async (req, res) => {
    try {
        await mongoclient()
        var objeto = await new ModelDocente()
        objeto.curp = req.params.curp.replace(":", "")
        objeto.escuelaclave = req.body.escuelaclave
        objeto.nombre = req.body.nombre
        objeto.telefono = req.body.telefono
        objeto.cuenta = req.body.cuenta
        objeto.oficina = req.body.oficina
        objeto.especialidad = req.body.especialidad
        objeto.grado = req.body.grado
        await ModelEscuelaDocente.updateOne(
            {},
            { $pull: { "docentes": { "curp": req.params.curp.replace(":", "") } } }
        )
        await ModelEscuelaDocente.updateOne(
            { "clave": req.body.escuelaclave },
            {
                $push: {
                    "docentes": objeto
                }
            }
        )
        await ModelDocente.updateOne({ "curp": req.params.curp.replace(":", "") },
            {
                $set: {
                    "escuelaclave": req.body.escuelaclave,
                    "nombre": req.body.nombre,
                    "telefono": req.body.telefono,
                    "cuenta": req.body.cuenta,
                    "oficina": req.body.oficina,
                    "especialidad": req.body.especialidad,
                    "grado": req.body.grado
                }
            })

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()

        res.json({ message: "documento actualizado exitosamente" })
    } catch (err) {
        console.error(err)
    }
})

router.get('/Administrativo', async (req, res) => {
    try {
        await mongoclient()
        const datos = await ModelAdministrativo.find()
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()
    } catch (err) {
        console.error(err)
    }
})

router.get('/Administrativo/:curp', async (req, res) => {
    try {
        await mongoclient()
        const curp = req.params.curp.replace(":", "")
        const datos = await ModelAdministrativo.find({ "curp": curp })
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()
    } catch (err) {
        console.error(err)
    }
})

router.post('/Administrativo', async (req, res) => {
    try {
        await mongoclient()
        var objeto = await new ModelAdministrativo()
        objeto.curp = req.body.curp
        objeto.escuelaclave = req.body.escuelaclave
        objeto.nombre = req.body.nombre
        objeto.telefono = req.body.telefono
        objeto.cuenta = req.body.cuenta
        objeto.funcion = req.body.funcion
        objeto.horaentrada = req.body.horaentrada
        objeto.horasalida = req.body.horasalida
        objeto.extensiontelefonica = req.body.extensiontelefonica
        objeto.correo = req.body.correo
        await ModelAdministrativo.insertMany([objeto])
        await ModelEscuelaAdmin.updateOne(
            { "clave": req.body.escuelaclave },
            {
                $push: {
                    "administrativos": objeto
                }
            }
        )

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()

        res.json({ message: "documento guardado exitosamente" })
    } catch (err) {
        console.error(err)
    }
})

router.put('/Administrativo/:curp', async (req, res) => {
    try {
        await mongoclient()
        var objeto = await new ModelAdministrativo()
        objeto.curp = req.params.curp.replace(":", "")
        objeto.escuelaclave = req.body.escuelaclave
        objeto.nombre = req.body.nombre
        objeto.telefono = req.body.telefono
        objeto.cuenta = req.body.cuenta
        objeto.funcion = req.body.funcion
        objeto.horaentrada = req.body.horaentrada
        objeto.horasalida = req.body.horasalida
        objeto.extensiontelefonica = req.body.extensiontelefonica
        objeto.correo = req.body.correo
        await ModelEscuelaAdmin.updateOne(
            {},
            { $pull: { "administrativos": { "curp": req.params.curp.replace(":", "") } } }
        )
        await ModelEscuelaAdmin.updateOne(
            { "clave": req.body.escuelaclave },
            {
                $push: {
                    "administrativos": objeto
                }
            }
        )
        await ModelAdministrativo.updateOne({ "curp": curp },
            {
                $set: {
                    "escuelaclave": req.body.escuelaclave,
                    "nombre": req.body.nombre,
                    "telefono": req.body.telefono,
                    "cuenta": req.body.cuenta,
                    "funcion": req.body.funcion,
                    "horaentrada": req.body.horaentrada,
                    "horasalida": req.body.horasalida,
                    "extensiontelefonica": req.body.extensiontelefonica,
                    "correo": req.body.correo
                }
            })

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()

        res.json({ message: "documento actualizado exitosamente" })
    } catch (err) {
        console.error(err)
    }
})

router.get('/Mantenimiento', async (req, res) => {
    try {
        await mongoclient()
        const datos = await ModelMantenimiento.find()
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()
    } catch (err) {
        console.error(err)
    }
})

router.get('/Mantenimiento/:curp', async (req, res) => {
    try {
        await mongoclient()
        const curp = req.params.curp.replace(":", "")
        const datos = await ModelMantenimiento.find({ "curp": curp })
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()
    } catch (err) {
        console.error(err)
    }
})

router.post('/Mantenimiento', async (req, res) => {
    try {
        await mongoclient()
        var objeto = await new ModelMantenimiento()
        objeto.curp = req.body.curp
        objeto.escuelaclave = req.body.escuelaclave
        objeto.nombre = req.body.nombre
        objeto.telefono = req.body.telefono
        objeto.cuenta = req.body.cuenta
        objeto.telefonoinst = req.body.telefonoinst
        objeto.area = req.body.area
        await ModelMantenimiento.insertMany([objeto])

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()

        res.json({ message: "documento guardado exitosamente" })
    } catch (err) {
        console.error(err)
    }
})

router.put('/Mantenimiento/:curp', async (req, res) => {
    try {
        await mongoclient()
        curp = req.params.curp.replace(":", "")
        escuelaclave = req.body.escuelaclave
        nombre = req.body.nombre
        telefono = req.body.telefono
        cuenta = req.body.cuenta
        telefonoinst = req.body.telefonoinst
        area = req.body.area
        await ModelMantenimiento.updateOne({ "curp": curp },
            {
                $set: {
                    "escuelaclave": escuelaclave,
                    "nombre": nombre,
                    "telefono": telefono,
                    "cuenta": cuenta,
                    "telefonoinst": telefonoinst,
                    "area": area
                }
            })

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()

        res.json({ message: "documento actualizado exitosamente" })
    } catch (err) {
        console.error(err)
    }
})

router.get('/Alumno', async (req, res) => {
    try {
        await mongoclient()
        const datos = await ModelAlumno.find()
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()
    } catch (err) {
        console.error(err)
    }
})

router.get('/Alumno/:curp', async (req, res) => {
    try {
        await mongoclient()
        const curp = req.params.curp.replace(":", "")
        const datos = await ModelAlumno.find({ "curp": curp })
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()
    } catch (err) {
        console.error(err)
    }
})

router.post('/Alumno', async (req, res) => {
    try {
        await mongoclient()
        var objeto = await new ModelAlumno()
        objeto.curp = req.body.curp
        objeto.tutor = req.body.tutor
        objeto.inscripcion.escuelaclave = req.body.escuelaclave
        objeto.inscripcion.fechainscripcion = req.body.fechainscripcion
        objeto.nombre = req.body.nombre
        objeto.fechanac = req.body.fechanac
        await ModelAlumno.insertMany([objeto])

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()

        res.json({ message: "documento guardado exitosamente" })
    } catch (err) {
        console.error(err)
    }
})

router.put('/Alumno/:curp', async (req, res) => {
    try {
        await mongoclient()
        curp = req.params.curp.replace(":", "")
        tutor = req.body.tutor
        escuelaclave = req.body.escuelaclave
        fechainscripcion = req.body.fechainscripcion
        nombre = req.body.nombre
        fechanac = req.body.fechanac
        await ModelAlumno.updateOne({ "curp": curp },
            {
                $set: {
                    "tutor": tutor,
                    "inscripcion": { "escuelaclave": escuelaclave, "fechainscripcion": fechainscripcion },
                    "nombre": nombre,
                    "fechanac": fechanac
                }
            })

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()

        res.json({ message: "documento actualizado exitosamente" })
    } catch (err) {
        console.error(err)
    }
})

router.get('/PersonalDocente', async (req, res) => {
    try {
        await mongoclient()
        const datos = await ModelEscuelaDocente.find()
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.set(key, ope, async(err,repy)=>{
            if(err) console.log(err);
            console.log(reply)
        })
    } catch (err) {
        console.error(err)
    }
})

router.get('/Tutorados/:curp', async (req, res) => {
    try {
        await mongoclient()
        const curp = req.params.curp.replace(":", "")
        const datos = await ModelDocente.aggregate([{ $lookup: { from: "alumnos", localField: "curp", foreignField: "tutor", as: "tutorados" } }, { $match: { "curp": curp } }])
        res.json(datos)

        const ope = req.method + " en " + req.url
        await redisclient.connect()
        await redisclient.set(key, ope)
        await redisclient.quit()
    } catch (err) {
        console.error(err)
    }
})

router.get('/PersonalAdministrativo', async (req, res) => {
    try {
        await mongoclient()
        const datos = await ModelEscuelaAdmin.find()
        res.json(datos)

        const ope = req.method + " en " + req.url
        
        await redisclient.set(key, ope)
        
    } catch (err) {
        console.error(err)
    }
})

module.exports = router;