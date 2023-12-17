import Productos from "../models/Productos.js";
import Categorias from "../models/Categorias.js";
import mongoose from "mongoose";

const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen, categoria } = req.body;
        if (Object.values(req.body).includes(""))
        return res
            .status(400)
            .json({ msg: "Lo sentimos, debes llenar todos los campos" });
        const verificarProducto = await Productos.findOne({ nombre });
        if (verificarProducto)
        return res
            .status(400)
            .json({ msg: "Lo sentimos, el producto ya se encuentra registrado, si desea agregar mas cantidad al producto, actulicelo" });
        const verificarCategoria = await Categorias.findById(categoria);
        if (!verificarCategoria)
        return res
            .status(400)
            .json({ msg: "Lo sentimos, la categoria no se encuentra registrada" });
        const nuevoProducto = new Productos(req.body);
        await nuevoProducto.save();
        res.status(200).json({ msg: "Producto registrado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Productos.find({}).where({ estado: true }).select("-__v -createdAt -updatedAt").populate({ path: "categoria", select: "nombre"});
        res.status(200).json({ productos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

const actualizarProducto = async (req, res) => {
    try {
        const {id} = req.params;
        const { categoria } = req.body;
        if (Object.values(req.body).includes(""))
        return res
            .status(400)
            .json({ msg: "Lo sentimos, debes llenar todos los campos" });
        const verificarProducto = await Productos.findById(id);
        if (!verificarProducto)
        return res
            .status(400)
            .json({ msg: "Lo sentimos, el producto no se encuentra registrado" });
        const verificarCategoria = await Categorias.findById(categoria);
        if (!verificarCategoria)
        return res
            .status(400)
            .json({ msg: "Lo sentimos, la categoria no se encuentra registrada" }); 
        await Productos.findByIdAndUpdate(verificarProducto._id, req.body);
        res.status(200).json({ msg: "Producto actualizado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const verificarProducto = await Productos.findById(id);
        if (!verificarProducto)
        return res
            .status(400)
            .json({ msg: "Lo sentimos, el producto no se encuentra registrado" });
        await Productos.findByIdAndDelete(verificarProducto._id);
        res.status(200).json({ msg: "Producto eliminado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}
const obtenerProducto = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ msg: "Lo sentimos, el id no es válido" });
        const producto = await Productos.findById(id).select("-__v -createdAt -updatedAt").populate({ path: "categoria", select: "nombre"});
        res.status(200).json({ producto });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

export { 
    crearProducto, 
    obtenerProductos, 
    actualizarProducto, 
    eliminarProducto,
    obtenerProducto 
};