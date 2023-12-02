import Usuarios from "../models/Usuarios.js"
import {sendMailToUser, sendMailToRecoveryPassword} from "../config/nodemailer.js"
import generarJWT from "../helpers/createJWT.js"

const login = async (req,res)=>{
    const {correo,contrasenia} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const usuarioBD = await Usuarios.findOne({correo}).select("-estado -__v -token -updatedAt -createdAt")
    if(usuarioBD?.confirmEmail===false) return res.status(400).json({msg:"Lo sentimos, debes confirmar tu cuenta"})
    if(!usuarioBD) return res.status(404).json({msg:"Lo sentimos, el usuario no existe"})
    const verificarPassword = await usuarioBD.matchPasswords(contrasenia)
    if(!verificarPassword) return res.status(400).json({msg:"Lo sentimos, la contraseña es incorrecta"})

    const token = await generarJWT(usuarioBD._id, usuarioBD.tipo_cuenta)
    const {nombre,apellido,correo:email,tipo_cuenta} = usuarioBD
    res.status(200).json({token,nombre,apellido,email,tipo_cuenta})

}
const registro = async (req,res)=>{
    const {correo,contrasenia} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Usuarios.findOne({correo})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoUsuario = new Usuarios(req.body)
    nuevoUsuario.contrasenia = await nuevoUsuario.encryptPassword(contrasenia)
    
    const token = nuevoUsuario.createToken()
    await sendMailToUser(correo,token)
    await nuevoUsuario.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}
const confirmEmail = async(req,res)=>{
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const usuarioBD = await Usuarios.findOne({token:req.params.token})
    if(!usuarioBD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    usuarioBD.token = null
    usuarioBD.confirmEmail=true
    await usuarioBD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}
const actualizarPassword = (req,res)=>{
    res.status(200).json({res:'actualizar password de un veterinario registrado'})
}
const recuperarPassword= async(req,res)=>{
    const {email: correo} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const usuarioBD = await Usuarios.findOne({email: correo})
    if(!usuarioBD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const token = usuarioBD.crearToken()
    usuarioBD.token=token
    await sendMailToRecoveryPassword(correo,token)
    await usuarioBD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}
const comprobarTokenPasword= async(req,res)=>{
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const usuarioBD = await Usuarios.findOne({token:req.params.token})
    if(usuarioBD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await usuarioBD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}
const nuevoPassword= async(req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const usuarioBD = await Usuarios.findOne({token:req.params.token})
    if(usuarioBD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    usuarioBD.token = null
    usuarioBD.password = await usuarioBD.encrypPassword(password)
    await usuarioBD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}

export {
    login,
    registro,
    confirmEmail,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}