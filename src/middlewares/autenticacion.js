import jwt from 'jsonwebtoken'
import Usuarios from '../models/Usuarios.js'

const verificarAutenticacion = async (req,res,next)=>{

if(!req.headers.authorization) return res.status(404).json({msg:"Lo sentimos, debes proprocionar un token"})    
    const {authorization} = req.headers
    try {
        const {id,rol} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
        if (rol==="Cliente"){
            req.usuarioBD = await Usuarios.findById(id).lean().select("-password")
            next()
        } 
        else if (rol==="Admin"){
            req.usuarioBD = await Usuarios.findById(id).lean().select("-password")
            next()
        }	
        else {
            return res.status(404).json({msg:"Lo sentimos, no tienes permisos para realizar esta acción"})
        }
    } catch (error) {
        const e = new Error("Formato del token no válido")
        return res.status(404).json({msg:e.message})
    }
}

// const verificarAutenticacionAdmin = async (req,res,next)=>{
//     if(!req.headers.authorization) return res.status(404).json({msg:"Lo sentimos, debes proprocionar un token"})    
//     const {authorization} = req.headers
//     try {
//         const {id,rol} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
//         if (rol==="Admin"){
//             req.usuarioBD = await Usuarios.findById(id).lean().select("-password")
//             next()
//         } else {
//             return res.status(404).json({msg:"Lo sentimos, no tienes permisos para realizar esta acción"})
//         }
//     } catch (error) {
//         const e = new Error("Formato del token no válido")
//         return res.status(404).json({msg:e.message})
//     }
// }

// export {
//     verificarAutenticacionCliente,
//     verificarAutenticacionAdmin
// }

export default verificarAutenticacion