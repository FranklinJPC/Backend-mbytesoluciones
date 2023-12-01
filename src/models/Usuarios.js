import mongoose, { Schema, model, mongo } from "mongoose";
const usuarioSchema = ({
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
    correo: {
        type: String,
        require: true,
        trim: true,
        maxlength: 30
    },
    contrasenia: {
        type: String,
        require: true,
        trim: true,
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
        require: true,
        default: "Cliente"
    }
}, {
    timestamps: true
})
usuarioSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncrypt = await bcrypt.hash(password, salt)
    return passwordEncrypt
}
usuarioSchema.methods.matchPasswords = async function(password){
    const response = await bcrypt.compare(password, this.password)
    return response
}
usuarioSchema.methods.createToken = function(){
    const generarToken = this.token = Math.random().toString(36).slice(2)
    return generarToken
}

export default model('Usuarios', usuarioSchema);