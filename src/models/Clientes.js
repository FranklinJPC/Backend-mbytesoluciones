import mongoose, { Schema, model } from "mongoose";
const clienteSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true,
        maxlength: 30
    },
    apellido: {
        type: String,
        require: true,
        trim: true,
        maxlength: 30
    },
    direccion: {
        type: String,
        require: true,
        trim: true,
        maxlength: 10
    },
    correo: {
        type: String,
        require: true,
        trim: true,
        maxlength: 40
    },
    telefono: {
        type: Number,
        trim: true,
        maxlength: 10
    },
    usuario: {
        type: mongoose.Types.ObjectId,
        ref: 'Usuarios'
    }
}, {
    timestamps: true
})

export default model("Clientes", clienteSchema);