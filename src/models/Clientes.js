import mongoose, { Schema, model } from "mongoose";
const clienteSchema = ({
    cedula: {
        type: Number,
        require: true,
        trim: true,
        maxlength: 11
    },
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
    email: {
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