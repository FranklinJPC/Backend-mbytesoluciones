import Usuarios from "../models/Usuarios.js";
import Clientes from "../models/Clientes.js";
import { sendMailToRecoveryPassword } from "../config/nodemailer.js";

const verPerfil = async (req, res) => {
    try {
        const clienteBD = await Clientes.findOne({ usuario: req.usuarioBD._id })
        .select("-__v -updatedAt -createdAt")
        .populate("usuario", "-__v -updatedAt -createdAt -estado -token -contrasenia -confirmEmail -nombre -apellido -correo");
        if (!clienteBD) return res.status(404).json({ msg: "Cliente no encontrado" });
        res.status(200).json({ clienteBD });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

const actualizarDatos = async (req, res) => {
    try {
        const { nombre, apellido, direccion, telefono } = req.body;
        if (Object.values(req.body).includes(""))
        return res
            .status(400)
            .json({ msg: "Lo sentimos, debes llenar todos los campos" });
        const usuarioBD = await Usuarios.findById(req.usuarioBD._id);
        if (!usuarioBD) return res.status(404).json({ msg: "Usuario no encontrado" });
        const clienteBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
        if (!clienteBD) return res.status(404).json({ msg: "Cliente no encontrado" });
        usuarioBD.nombre = nombre;
        usuarioBD.apellido = apellido;
        clienteBD.nombre = nombre;
        clienteBD.apellido = apellido;
        clienteBD.direccion = direccion;
        clienteBD.telefono = telefono;
        await usuarioBD.save();
        await clienteBD.save();
        res.status(200).json({ msg: "Datos actualizados correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}
const actualizarPassword = async (req, res) => {
    try {
        const usuarioBD = await Usuarios.findById(req.usuarioBD._id);
        const { oldercontrasenia, nuevaContrasenia, confirmcontrasenia} = req.body;
        if (Object.values(req.body).includes(""))
        return res
            .status(400)
            .json({ msg: "Lo sentimos, debes llenar todos los campos" });
        if (!usuarioBD) return res.status(404).json({ msg: "Usuario no encontrado" });
        const verificarPassword = await usuarioBD.matchPasswords(oldercontrasenia);
        if (!verificarPassword)
        return res.status(400).json({ msg: "Lo sentimos, la contraseña actual es incorrecta" });
        if (nuevaContrasenia !== confirmcontrasenia)
        return res.status(400).json({ msg: "Las contraseñas no coinciden" });
        usuarioBD.contrasenia = await usuarioBD.encryptPassword(nuevaContrasenia);
        await usuarioBD.save();
        res.status(200).json({ msg: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

const listarClientes = async (req, res) => {
    try {
        const clientesBD = await Clientes.find()
        .select("-__v -updatedAt -usuario");
        if (!clientesBD) return res.status(404).json({ msg: "No hay clientes registrados" });
        res.status(200).json({ clientesBD });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

export {
    verPerfil,
    actualizarDatos,
    actualizarPassword,
    listarClientes
}