import { carrito, agregarProducto } from "../models/Articulo.carrito.compras.js";
import Producto from "../models/Productos.js";
import Clientes from "../models/Clientes.js";

const aniadirProductos = async (req, res) => {
    const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
    const { id_producto} = req.body;
    const cantidad = Number.parseInt(req.body.cantidad);
    try {
        let Carrito = await carrito();
        const productoBDD = await Producto.findById(id_producto);
        if (!productoBDD) 
        return res
            .status(400)
            .json({ mensaje: "El producto no existe" });
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
        let Carrito = await carrito();
        if(Carrito.items.length === 0){
            return res
                .status(400)
                .json({ mensaje: "No hay productos en el carrito" });
        }
        res.status(200).json({ mensaje: "Carrito de compras", Carrito });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Lo sentimos, ha ocurrido un error", error });
    }
}

const vaciarCarrito = async (req, res) => {
    try {
        let Carrito = await carrito();
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
        let Carrito = await carrito();
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

export{
    aniadirProductos,
    verCarrito,
    vaciarCarrito,
    eliminarProducto
}