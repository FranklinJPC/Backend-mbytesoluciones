import Categorias from "../models/Categorias.js";
import Productos from "../models/Productos.js";

const crearCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (Object.values(req.body).includes(""))
            return res
                .status(400)
                .json({ msg: "Lo sentimos, debes llenar todos los campos" });
        const verificarCategoria = await Categorias.findOne({ nombre });
        if (verificarCategoria)
            return res
                .status(400)
                .json({ msg: "Lo sentimos, la categoria ya se encuentra registrada" });
        const nuevaCategoria = new Categorias(req.body);
        await nuevaCategoria.save();
        res.status(200).json({ msg: "Categoria registrada con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categorias.find();
        res.status(200).json({ categorias });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

const obtenerCategoriasDetalles = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await Categorias.findById(id);
        res.status(200).json({ categoria });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        if (Object.values(req.body).includes(""))
            return res
                .status(400)
                .json({ msg: "Lo sentimos, debes llenar todos los campos" });
        const verificarCategoria = await Categorias.findById(id);
        if (!verificarCategoria)
            return res
                .status(400)
                .json({ msg: "Lo sentimos, la categoria no se encuentra registrada" });
        await Categorias.findByIdAndUpdate(verificarCategoria._id, req.body);
        res.status(200).json({ msg: "Categoria actualizada con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" });
    }
}

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const verificarCategoria = await Categorias.findById(id);
        if (!verificarCategoria)
            return res
                .status(400)
                .json({ msg: "Lo sentimos, la categoria no se encuentra registrada" });
        const verificarProducto = await Productos.findOne({ categoria: verificarCategoria._id });
        if (verificarProducto)
            return res
                .status(400)
                .json({ msg: "Lo sentimos, la categoria no se puede eliminar porque tiene productos asociados" });
        await Categorias.findByIdAndDelete(verificarCategoria._id);
        res.status(200).json({ msg: "Categoria eliminada con éxito" });       
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error" }); 
    }
}

export {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasDetalles,
    actualizarCategoria,
    eliminarCategoria
}
