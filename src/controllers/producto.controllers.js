import Productos from "../models/Productos.js";
import Categorias from "../models/Categorias.js";
import mongoose from "mongoose";
import {uploadImage, deleteImage} from "../config/cloudinary.js";
import fs from "fs-extra";
import path from "path";

const crearProducto = async (req, res) => {
    try {
        const { nombre, imagen, categoria } = req.body;
        // Validaciones
        if (Object.values(req.body).includes(""))
        return res
            .status(400)
            .json({ msg: "Lo sentimos, debes llenar todos los campos" });
        const verificarProducto = await Productos.findOne({ nombre });
        if (verificarProducto && verificarProducto.categoria == categoria)
        return res
            .status(400)
            .json({ msg: "Lo sentimos, el producto ya se encuentra registrado, si desea agregar mas cantidad al producto, actualicelo" });
        const verificarCategoria = await Categorias.findById(categoria);
        if (!verificarCategoria)
        return res
            .status(400)
            .json({ msg: "Lo sentimos, la categoria no se encuentra registrada" });
        const nuevoProducto = new Productos(req.body);
        // Imagen
        if(!req.files?.imagen) return res.status(400).json({msg:"Lo sentimos, debes subir una imagen"})
        const extension = path.extname(req.files.imagen.name).toLowerCase();
        const extensionesValidas = [".png", ".jpg", ".jpeg"];
        if (!extensionesValidas.includes(extension))
        return res.status(400).json({ msg: "Lo sentimos, debes subir una imagen con extensión PNG, JPG o JPEG" });
        if (req.files.imagen.size > 1024 * 1024 * 2)
        return res.status(400).json({ msg: "Lo sentimos, la imagen no debe pesar más de 2MB" });
        // Fin Validaciones
        const imagenBDD = await uploadImage(req.files.imagen.tempFilePath)
        nuevoProducto.imagen = {
            public_id: imagenBDD.public_id,
            secure_url: imagenBDD.secure_url
        }
        await fs.unlink(req.files.imagen.tempFilePath);
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
        const { categoria, precio_venta, precio, cantidad } = req.body;
        // Validaciones
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
        const verificarNumeros = [precio_venta, precio, cantidad];
        verificarNumeros.forEach(numero => {
            if (isNaN(numero))
            return res
                .status(400)
                .json({ msg: "Lo sentimos, el precio, precio de venta y/o cantidad deben ser números" });
        });
        // Fin Validaciones Datos
        // Imagen Actulizar
        if(req.files?.imagen){
            // Validaciones Imagen
            if(!(req.files?.imagen)) return res.status(400).json({msg:"Lo sentimos, debes subir una imagen"})
            const extension = path.extname(req.files.imagen.name).toLowerCase();
            const extensionesValidas = [".png", ".jpg", ".jpeg"];
            if (!extensionesValidas.includes(extension))
            return res.status(400).json({ msg: "Lo sentimos, debes subir una imagen con extensión PNG, JPG o JPEG" });
            if (req.files.imagen.size > 1024 * 1024 * 2)
            return res.status(400).json({ msg: "Lo sentimos, la imagen no debe pesar más de 2MB" });
            // Fin Validaciones Imagen
            await deleteImage(verificarProducto.imagen.public_id)
            const imagenBDD = await uploadImage(req.files.imagen.tempFilePath)
            const data = {
                nombre: req.body.nombre || verificarProducto.nombre,
                descripcion: req.body.descripcion || verificarProducto.descripcion,
                precio: req.body.precio || verificarProducto.precio,
                precio_venta: req.body.precio_venta || verificarProducto.precio_venta,
                marca: req.body.marca || verificarProducto.marca,
                cantidad: req.body.cantidad || verificarProducto.cantidad,
                categoria: req.body.categoria || verificarProducto.categoria,
                imagen: {
                    public_id: imagenBDD.public_id,
                    secure_url: imagenBDD.secure_url
                }
            }
            await fs.unlink(req.files.imagen.tempFilePath);
            await Productos.findByIdAndUpdate(req.params.id, data);
        }
        else{
            await Productos.findByIdAndUpdate(req.params.id, req.body);
        }
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
        await deleteImage(verificarProducto.imagen.public_id);
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
const crearImagenPrueba = async (req, res) => {
    try {
        const data = {
            nombre: "Laptop",
            descripcion: "Una laptop de prueba",
            precio: 1000,
            precio_venta: 1050,
            marca: "Samsung",
            cantidad: 10,
            categoria: "657f69221d6cfd4216f91302"
        }
        // Imagen
        if(!req.files?.imagen) return res.status(400).json({msg:"Lo sentimos, debes subir una imagen"})
        const extension = path.extname(req.files.imagen.name).toLowerCase();
        const extensionesValidas = [".png", ".jpg", ".jpeg"];
        if (!extensionesValidas.includes(extension))
        return res.status(400).json({ msg: "Lo sentimos, debes subir una imagen con extensión PNG, JPG o JPEG" });
        if (req.files.imagen.size > 1024 * 1024 * 2)
        return res.status(400).json({ msg: "Lo sentimos, la imagen no debe pesar más de 2MB" });
        const imagenBDD = await uploadImage(req.files.imagen.tempFilePath)
        const nuevoProducto = new Productos(data);
        nuevoProducto.imagen = {
            public_id: imagenBDD.public_id,
            secure_url: imagenBDD.secure_url
        }
        await fs.unlink(req.files.imagen.tempFilePath);
        await nuevoProducto.save();
        res.status(200).json({ msg: "Producto registrado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" }); 
    }
}

const obtenerProductosPorMarcas = async (req, res) => {
    try {
        const productos = await Productos.find({}).where({ estado: true }).select("-__v -createdAt -updatedAt");
        const marcas = [];
        productos.forEach(producto => {
            if (!marcas.includes(producto.marca)) {
                marcas.push(producto.marca);
            }
        });
        const productosPorMarca = [];
        marcas.forEach(marca => {
            const productosDeMarca = productos.filter(producto => producto.marca === marca);
            productosPorMarca.push({ marca, productos: productosDeMarca });
        });
        res.status(200).json({ productosPorMarca });
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
    obtenerProducto,
    crearImagenPrueba,
    obtenerProductosPorMarcas
};