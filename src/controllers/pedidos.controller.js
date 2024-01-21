import { pedido, agregarPedido } from '../models/Articulo.pedido.js';
import { carrito } from '../models/Articulo.carrito.compras.js';
import Clientes from '../models/Clientes.js';
import Pedidos from '../models/Pedidos.js';
import Productos from '../models/Productos.js';
import { sendMailNotifyOrder } from '../config/nodemailer.js';

const crearPedido = async (req, res) => {
    const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id }).select('-estado -__v -usuario -updatedAt -createdAt');
    const pedidoBD = await pedido();
    try {
        const carritoBD = await carrito(usuarioBD._id);
        // console.log(pedidoBD)
        if (!carritoBD) return res.status(400).json({ mensaje: 'El carrito no existe' });
        else if (carritoBD.estado === false) return res.status(400).json({ mensaje: 'El carrito no tiene productos' });
        else if (carritoBD.id_cliente.toString() !== usuarioBD._id.toString()) return res.status(400).json({ mensaje: 'El carrito no pertenece al usuario' });
        const verificarPedido = await Pedidos.countDocuments({ cliente: usuarioBD._id, estado: 'Pendiente' });
        // Validaciones
        console.log(verificarPedido)

        if (verificarPedido >= 3) return res.status(400).json({ mensaje: 'El limite de pedidos es de 3 por cliente' });
        if (req.body.domicilio !== 0 && req.body.domicilio !== 1) return res.status(400).json({ mensaje: 'El domicilio no es válido, utilice el formato booleano, 0 o 1' });
        if (req.body.domicilio === 1 && !req.body.observaciones) return res.status(400).json({ mensaje: 'La dirección es obligatoria en observaciones' });
        if (!req.body.forma_pago) return res.status(400).json({ mensaje: 'La forma de pago es obligatoria' });
        if (req.body.forma_pago !== 'Transferencia Bancaria' && req.body.forma_pago !== 'Pago en Efectivo') return res.status(400).json({ mensaje: 'La forma de pago no es válida, solo mediante: Pago en Efectivo o Transferencia Bancaria' });
        if (!req.body.observaciones) req.body.observaciones = 'Sin observaciones';
        const nuevoPedido = {
            cliente: usuarioBD,
            items: carritoBD.items,
            domicilio: req.body.domicilio,
            observaciones: req.body.observaciones,
            forma_pago: req.body.forma_pago,
            total: carritoBD.subtotal
        }
        // console.log(pedidoBD)
        const pedido = await agregarPedido(nuevoPedido);
        res.status(200).json({ mensaje: 'Pedido creado con éxito', pedido });

        // Vaciar carrito
        carritoBD.items = [];
        carritoBD.subtotal = 0;
        carritoBD.estado = false;
        await carritoBD.save();

        // Reducir stock
        const items = pedido.items;
        items.forEach(async item => {
            const productoBD = await Productos.findById(item.id_producto);
            productoBD.cantidad = productoBD.cantidad - item.cantidad;
            await productoBD.save();
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al crear el pedido' });
    }
}

const visulizarPedido = async (req, res) => {
    const { id } = req.params;
    const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
    try {
        // Validaciones
        if (!usuarioBD) return res.status(400).json({ mensaje: 'El usuario no existe' });
        const pedidoBDD = await Pedidos.findById(id).populate({
            path: "items.id_producto",
            select: "nombre total imagen"
        }).select('-__v  -updatedAt -createdAt');
        if (!pedidoBDD) return res.status(400).json({ mensaje: 'No existe el pedido' });
        if (pedidoBDD.cliente.toString() !== usuarioBD._id.toString()) return res.status(400).json({ mensaje: 'El pedido no pertenece al usuario' });
        // Fin de validaciones
        res.status(200).json({ mensaje: `Pedido ${pedidoBDD.estado}`, pedido: pedidoBDD });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al visualizar el pedido' });
    }


    // Codigo de Pruebas
    // const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
    // try {
    //     if (!usuarioBD) return res.status(400).json({ mensaje: 'El usuario no existe' });
    //     const pedidoBD = await Pedidos.findOne({ cliente: usuarioBD._id, estado: 'Pendiente' });
    //     if (!pedidoBD) return res.status(400).json({ mensaje: 'No existe un pedido pendiente' });
    //     res.status(200).json({ mensaje: `Pedido ${pedidoBD.estado}`, pedidoBD });
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ mensaje: 'Error al visualizar el pedido' });
    // }
}

const visulizarPedidos = async (req, res) => {
    try {
        const pedidosBD = await Pedidos.find().populate({
            path: "cliente",
            select: "nombre telefono"
        }).select('-items -__v -updatedAt -createdAt -total');
        if (!pedidosBD) return res.status(400).json({ mensaje: 'No existen pedidos' });
        res.status(200).json({ mensaje: 'Pedidos', pedidosBD });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al visualizar los pedidos' });
    }
}

const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedidoBD = await Pedidos.findById(id);
        // Validaciones
        if (!pedidoBD) return res.status(400).json({ mensaje: 'No existe el pedido' });
        if (pedidoBD.estado === 'Finalizado' || pedidoBD.estado === 'Anulado') 
        return res.status(400).json({ mensaje: 'El pedido ya fue finalizado o anulado' });
        pedidoBD.estado = req.body.estado;
        if (req.body.estado === 'Finalizado') {
            pedidoBD.fecha_finalizada = Date.now();
        }
        else if (req.body.estado === 'Anulado') {
            const items = pedidoBD.items;
            items.forEach(async item => {
                const productoBD = await Productos.findById(item.id_producto);
                productoBD.cantidad = productoBD.cantidad + item.cantidad;
                await productoBD.save();
            });
            pedidoBD.fecha_finalizada = Date.now();
        }
        else return res.status(400).json({ mensaje: 'El estado no es válido' });
        // Fin de validaciones
        const usuarioBD = await Clientes.findById(pedidoBD.cliente);
        // Correo de notificación
        await sendMailNotifyOrder(usuarioBD.correo, req.body.estado);
        await pedidoBD.save();
        res.status(200).json({ mensaje: 'Pedido actualizado', pedidoBD });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al actualizar el pedido' });
    }
}

const historialPedidos = async (req, res) => {
    const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
    try {
        if (!usuarioBD) return res.status(400).json({ mensaje: 'El usuario no existe' });
        const pedidosBD = await Pedidos.find({ cliente: usuarioBD._id }).populate({
            path: "items.id_producto",
            select: "nombre"
        }).select('-__v -updatedAt -createdAt');
        if (!pedidosBD) return res.status(400).json({ mensaje: 'No existen pedidos' });
        res.status(200).json({ mensaje: 'Pedidos', pedidosBD });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al visualizar los pedidos' });
    }
}

export {
    crearPedido,
    visulizarPedido,
    visulizarPedidos,
    actualizarPedido,
    historialPedidos
}