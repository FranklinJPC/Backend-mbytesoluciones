import mongoose, { Schema, model, mongo } from "mongoose";
import bcrypt from "bcryptjs";
const usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true,
        maxlength: 20
    },
    apellido: {
        type: String,
        require: true,
        trim: true,
        maxlength: 50
    },
    correo: {
        type: String,
        require: true,
        trim: true,
        maxlength: 50
    },
    contrasenia: {
        type: String,
        require: true,
        trim: true,
        maxlength: 20
    },
    token: {
        type: String,
        default: null,
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true
    },
    tipo_cuenta: {
        type: String,
        default: "Cliente"
    }
}, {
    timestamps: true
})
usuarioSchema.methods.encryptPassword = async function(contrasenia){
    const salt = await bcrypt.genSalt(10)
    const passwordEncrypt = await bcrypt.hash(contrasenia, salt)
    return passwordEncrypt
}
usuarioSchema.methods.matchPasswords = async function(contrasenia){
    const response = await bcrypt.compare(contrasenia, this.contrasenia)
    return response
}
usuarioSchema.methods.createToken = function(){
    const generarToken = this.token = Math.random().toString(36).slice(2)
    return generarToken
}

export default model('Usuarios', usuarioSchema);