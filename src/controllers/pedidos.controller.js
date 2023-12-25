import { pedido, agregarPedido } from '../models/Articulo.pedido.js';
import { carrito } from '../models/Articulo.carrito.compras.js';
import Clientes from '../models/Clientes.js';
import Pedidos from '../models/Pedidos.js';

const crearPedido = async (req, res) => {
    const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
    const pedidoBD = await pedido();
    try {
        const carritoBD = await carrito();
        // console.log(pedidoBD)
        if (!carritoBD) return res.status(400).json({ mensaje: 'El carrito no existe' });
        else if (carritoBD.estado === false) return res.status(400).json({ mensaje: 'El carrito no tiene productos' });
        else if (carritoBD.id_cliente.toString() !== usuarioBD._id.toString()) return res.status(400).json({ mensaje: 'El carrito no pertenece al usuario' });
        const verificarPedido = await Pedidos.findOne({ cliente: usuarioBD._id, estado: 'Pendiente' });
        if (verificarPedido) return res.status(400).json({ mensaje: 'Ya existe un pedido pendiente' });
        const nuevoPedido = {
            cliente: usuarioBD,
            items: carritoBD.items,
            total: carritoBD.subtotal
        }
        console.log(pedidoBD)
        const pedido = await agregarPedido(nuevoPedido);
        res.status(200).json({ mensaje: 'Pedido creado con éxito', pedido });

        // Vaciar carrito
        carritoBD.items = [];
        carritoBD.subtotal = 0;
        carritoBD.estado = false;
        await carritoBD.save();

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al crear el pedido' });
    }
}

const visulizarPedido = async (req, res) => {
    const usuarioBD = await Clientes.findOne({ usuario: req.usuarioBD._id });
    try {
        const pedidoBD = await Pedidos.findOne({ cliente: usuarioBD._id });
        if (!pedidoBD) return res.status(400).json({ mensaje: 'No existe un pedido pendiente' });
        res.status(200).json({ mensaje: `Pedido ${pedidoBD.estado}`, pedidoBD });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al visualizar el pedido' });
    }
}

const visulizarPedidos = async (req, res) => {
    try {
        const pedidosBD = await Pedidos.find();
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
        if (!pedidoBD) return res.status(400).json({ mensaje: 'No existe el pedido' });
        pedidoBD.estado = req.body.estado;
        await pedidoBD.save();
        res.status(200).json({ mensaje: 'Pedido actualizado', pedidoBD });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error al actualizar el pedido' });
    }
}

export {
    crearPedido,
    visulizarPedido,
    visulizarPedidos,
    actualizarPedido
}