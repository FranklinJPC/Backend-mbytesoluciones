import Usuarios from "../models/Usuarios.js"
import Clientes from "../models/Clientes.js"
import {sendMailToUser, sendMailToRecoveryPassword} from "../config/nodemailer.js"
import generarJWT from "../helpers/createJWT.js"

const login = async (req,res)=>{
    try {
        const {correo,contrasenia} = req.body
        // Validaciones
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const validacionEmail = /\S+@\S+\.\S+/;
        if(!validacionEmail.test(correo)) return res.status(400).json({msg:"Lo sentimos, el email no es válido"})
        const usuarioBD = await Usuarios.findOne({correo}).select("-estado -__v -token -updatedAt -createdAt")
        if(usuarioBD?.confirmEmail===false) return res.status(400).json({msg:"Lo sentimos, debes confirmar tu cuenta"})
        if(usuarioBD?.estado===false) return res.status(400).json({msg:"Lo sentimos, tu cuenta esta inactiva"})
        if(!usuarioBD) return res.status(404).json({msg:"Lo sentimos, el usuario no existe"})
        const verificarPassword = await usuarioBD.matchPasswords(contrasenia)
        if(!verificarPassword) return res.status(400).json({msg:"Lo sentimos, la contraseña y/o el correo es incorrecto"})
        // Fin de validaciones
    
        const token = await generarJWT(usuarioBD._id, usuarioBD.tipo_cuenta)
        const {nombre,apellido,correo:email,tipo_cuenta} = usuarioBD
        res.status(200).json({token,nombre,apellido,email,tipo_cuenta})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Lo sentimos, ha ocurrido un error"})
    }

}
const registro = async (req,res)=>{
    try {
        const { correo,contrasenia, nombre, apellido, telefono, direccion } = req.body
        // Validaciones
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const verificarEmailBDD = await Usuarios.findOne({correo})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        if(nombre.length > 20) return res.status(400).json({msg:"Lo sentimos, el nombre no puede tener más de 20 caracteres"})
        if(apellido.length > 50) return res.status(400).json({msg:"Lo sentimos, el apellido no puede tener más de 50 caracteres"})
        if(telefono.length > 10) return res.status(400).json({msg:"Lo sentimos, el telefono no puede tener más de 10 caracteres"})
        if(direccion.length > 100) return res.status(400).json({msg:"Lo sentimos, la direccion no puede tener más de 100 caracteres"})
        const validacionLetras = /^[a-zA-Z]+$/;
        if(!validacionLetras.test(nombre)) return res.status(400).json({msg:"Lo sentimos, el nombre solo puede contener letras sin espacios"})
        if(!validacionLetras.test(apellido)) return res.status(400).json({msg:"Lo sentimos, el apellido solo puede contener letras sin espacios"})
        const validacionNumero = /^[0-9]+$/;
        if(!validacionNumero.test(telefono)) return res.status(400).json({msg:"Lo sentimos, el telefono solo puede contener números sin espacios"})
        const validacionEmail = /\S+@\S+\.\S+/;
        if(!validacionEmail.test(correo)) return res.status(400).json({msg:"Lo sentimos, el email no es válido"})
        // Validar contraseña
        const validacionPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){10,}$/;
        if(!validacionPassword.test(contrasenia)) return res.status(400).json({msg:"Lo sentimos, el password debe tener mínimo 10 caracteres, una mayúscula, una minúscula, un número y un caracter especial"})
        // Fin de validaciones
        const nuevoUsuario = new Usuarios(req.body)
        nuevoUsuario.contrasenia = await nuevoUsuario.encryptPassword(contrasenia)
        
        const token = nuevoUsuario.createToken()
        await sendMailToUser(correo, token)
        const nuevoCliente = new Clientes({nombre,apellido,correo, telefono, direccion ,usuario:nuevoUsuario._id})
        await nuevoCliente.save()
        await nuevoUsuario.save()
        res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Lo sentimos, ha ocurrido un error"})
    }
}
const confirmEmail = async(req,res)=>{
    try {
        if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        const usuarioBD = await Usuarios.findOne({token:req.params.token})
        if(!usuarioBD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
        usuarioBD.token = null
        usuarioBD.confirmEmail=true
        usuarioBD.estado=true
        await usuarioBD.save()
        res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Lo sentimos, ha ocurrido un error"})
    }
}
const recuperarPassword= async(req,res)=>{
    try {
        const {correo} = req.body
        // Validaciones
        const validacionEmail = /\S+@\S+\.\S+/;
        if(!validacionEmail.test(correo)) return res.status(400).json({msg:"Lo sentimos, el email no es válido"})
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const usuarioBD = await Usuarios.findOne({correo: correo})
        if(!usuarioBD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
        if(usuarioBD?.confirmEmail===false) return res.status(400).json({msg:"Lo sentimos, se debe confirmar la cuenta"})
        if(usuarioBD?.estado===false) return res.status(400).json({msg:"Lo sentimos, la cuenta esta inactiva"})
        // Fin de validaciones
        const token = usuarioBD.createToken()
        usuarioBD.token=token
        await sendMailToRecoveryPassword(correo,token)
        await usuarioBD.save()
        res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Lo sentimos, ha ocurrido un error"})
    }
}
const comprobarTokenPasword= async(req,res)=>{
    try {
        if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        const usuarioBD = await Usuarios.findOne({token:req.params.token})
        if(usuarioBD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        await usuarioBD.save()
        res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Lo sentimos, ha ocurrido un error"})
    }
}
const nuevoPassword= async(req,res)=>{
    try {
        const{password,confirmpassword} = req.body
        // Validaciones
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
        if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
        const usuarioBD = await Usuarios.findOne({token:req.params.token})
        if(usuarioBD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta por el token"})
        const verificarPassword = await usuarioBD.matchPasswords(password)
        if(verificarPassword) return res.status(400).json({msg:"Lo sentimos, el password no puede ser igual al anterior"})
        const validacionPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){10,}$/;
        if(!validacionPassword.test(password)) return res.status(400).json({msg:"Lo sentimos, el password debe tener mínimo 10 caracteres, una mayúscula, una minúscula, un número y un caracter especial"})
        // Fin de validaciones
        usuarioBD.token = null
        usuarioBD.contrasenia = await usuarioBD.encryptPassword(password)
        await usuarioBD.save()
        res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
    } catch (error) {
        console.log(error)
        res.status(500).json({msg:"Lo sentimos, ha ocurrido un error"})
    }
}

export {
    login,
    registro,
    confirmEmail,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}