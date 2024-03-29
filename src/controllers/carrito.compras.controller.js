import { carrito, agregarProducto } from "../models/Articulo.carrito.compras.js";
import Producto from "../models/Productos.js";
import Clientes from "../models/Clientes.js";

const aniadirProductos = async (req, res) => {
    const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id }).select("-estado -__v -usuario -updatedAt -createdAt");
    const { id_producto } = req.body;
    const cantidad = Number.parseInt(req.body.cantidad);
    try {
        let Carrito = await carrito(usuarioBD._id);
        const productoBDD = await Producto.findById(id_producto);
        // Validaciones
        if (!productoBDD) 
        return res
            .status(400)
            .json({ mensaje: "El producto no existe" });
        if (cantidad > productoBDD.cantidad)
        return res
            .status(400)
            .json({ mensaje: "No hay suficiente stock" });
        if (cantidad == "") return res.status(400).json({ mensaje: 'La cantidad es obligatoria' });
        if (cantidad <= 0) return res.status(400).json({ mensaje: 'La cantidad debe ser mayor a 0' });
        if (cantidad == null || id_producto == null) return res.status(400).json({ mensaje: 'Los campos son obligatorios' });
        // Fin validaciones
        if(Carrito){
            const verificarIndex = Carrito.items.findIndex(item => item.id_producto.id == id_producto);
            Carrito.estado = true;
            if (verificarIndex !== -1 && cantidad <= 0){
                Carrito.items.splice(verificarIndex, 1);
                if(Carrito.items.length === 0){
                    Carrito.subtotal = 0;
                }
                else{
                    Carrito.subtotal = Carrito.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
            }
            else if (verificarIndex !== -1){
                Carrito.items[verificarIndex].cantidad = Carrito.items[verificarIndex].cantidad + cantidad;
                Carrito.items[verificarIndex].total = Carrito.items[verificarIndex].cantidad * productoBDD.precio_venta;
                Carrito.items[verificarIndex].precio = productoBDD.precio_venta;
                Carrito.subtotal = Carrito.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            else if (cantidad > 0){
                Carrito.items.push({
                    id_producto: productoBDD,
                    cantidad: cantidad,
                    precio: productoBDD.precio_venta,
                    total: productoBDD.precio_venta * cantidad
                });
                Carrito.subtotal = Carrito.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            else{
                return res
                    .status(400)
                    .json({ mensaje: "La cantidad debe ser mayor a 0" });
            }
            const data = await Carrito.save();
            res.status(200).json({ mensaje: "Producto añadido con éxito", data });
        }
        else{
            const datosCarrito = {
                id_cliente: usuarioBD,
                items: [{
                    id_producto: productoBDD,
                    cantidad: cantidad,
                    precio: productoBDD.precio_venta,
                    total: productoBDD.precio_venta * cantidad
                }],
                subtotal: productoBDD.precio_venta * cantidad
            }
            Carrito = await agregarProducto(datosCarrito);
            res.status(200).json({ mensaje: "Producto añadido con éxito", carrito: Carrito });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Lo sentimos, ha ocurrido un error", error });
    }
}

const verCarrito = async (req, res) => {
    try {
        const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
        if (!usuarioBD) return res.status(400).json({ mensaje: 'El usuario no existe' });
        let Carrito = await carrito(usuarioBD._id);
        // console.log(Carrito)
        if(Carrito.id_cliente.toString() === usuarioBD._id.toString() && Carrito.estado){
            res.status(200).json({ mensaje: "Carrito de compras", Carrito });
        }
        else if(Carrito.items.length === 0 || !Carrito.estado){
            return res
                .status(400)
                .json({ mensaje: "No hay productos en el carrito" });
        }
        else if (Carrito.id_cliente.toString() !== usuarioBD._id.toString()){
            return res
                .status(400)
                .json({ mensaje: "El carrito no pertenece al usuario" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Lo sentimos, ha ocurrido un error", error });
    }
}

const vaciarCarrito = async (req, res) => {
    try {
        const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
        if (!usuarioBD) return res.status(400).json({ mensaje: 'El usuario no existe' });
        let Carrito = await carrito(usuarioBD._id);
        if(Carrito.items.length === 0){
            return res
                .status(400)
                .json({ mensaje: "No hay productos en el carrito" });
        }
        Carrito.items = [];
        Carrito.subtotal = 0;
        Carrito.estado = false;
        let data = await Carrito.save();
        res.status(200).json({ mensaje: "Carrito vaciado con éxito", data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Lo sentimos, ha ocurrido un error", error });
    }
}

const eliminarProducto = async (req, res) => {
    try {
        const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
        if (!usuarioBD) return res.status(400).json({ mensaje: 'El usuario no existe' });
        let Carrito = await carrito(usuarioBD._id);
        const verificarIndex = Carrito.items.findIndex(item => item.id_producto.id == req.params.id);
        if (verificarIndex !== -1){
            Carrito.items.splice(verificarIndex, 1);
            if(Carrito.items.length === 0){
                Carrito.subtotal = 0;
                Carrito.estado = false;
            }
            else{
                Carrito.subtotal = Carrito.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            const data = await Carrito.save();
            res.status(200).json({ mensaje: "Producto eliminado con éxito", data });
            
        }
        else{
            return res
                .status(400)
                .json({ mensaje: "El producto no existe en el carrito" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Lo sentimos, ha ocurrido un error", error });
    }
}

const actulizarCantidad = async (req, res) => {
    try {
        const productoBDD = await Producto.findById(req.params.id);
        const { cantidad } = req.body;
        if (!productoBDD)
        return res
            .status(400)
            .json({ mensaje: "El producto no existe" });
        if (productoBDD.cantidad < cantidad)
        return res
            .status(400)
            .json({ mensaje: "No hay suficiente stock" });
        if (cantidad <= 0) return res.status(400).json({ mensaje: 'La cantidad debe ser mayor a 0' });    
        const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
        if (!usuarioBD) return res.status(400).json({ mensaje: 'El usuario no existe' });
        let Carrito = await carrito(usuarioBD._id);
        const verificarIndex = Carrito.items.findIndex(item => item.id_producto.id == req.params.id);
        if (verificarIndex !== -1){
            Carrito.items[verificarIndex].cantidad = cantidad;
            Carrito.items[verificarIndex].total = cantidad * Carrito.items[verificarIndex].precio;
            Carrito.subtotal = Carrito.items.map(item => item.total).reduce((acc, next) => acc + next);
            const data = await Carrito.save();
            res.status(200).json({ mensaje: "Producto actualizado con éxito", data });
        }
        else{
            return res
                .status(400)
                .json({ mensaje: "El producto no existe en el carrito" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Lo sentimos, ha ocurrido un error", error });
    }
}

export{
    aniadirProductos,
    verCarrito,
    vaciarCarrito,
    eliminarProducto,
    actulizarCantidad
}