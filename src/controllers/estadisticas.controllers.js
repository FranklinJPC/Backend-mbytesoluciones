import mongoose from "mongoose";
import Usuarios from "../models/Usuarios.js";
import Pedidos from "../models/Pedidos.js";

const obtenerEstadisticas = async (req, res) => {
    try {
        const usuarios_registrados = await Usuarios.find({ estado: true }).countDocuments();
        const pedidos = await Pedidos.find({});
        const NroPedidos = await Pedidos.find({}).countDocuments();
        const pedidosLista = []
        const pedidosListaContable = []
        pedidos.forEach(pedido => {
            if(!pedidosLista.includes(pedido.estado)){
                pedidosLista.push(pedido.estado)
            }
        })
        pedidosLista.forEach(estado => {
            const pedidosEstado = pedidos.filter(pedido => pedido.estado === estado)
            pedidosListaContable.push({estado, pedidos: pedidosEstado.length})
        })
        const data = {
            usuarios_registrados,
            NroPedidos,
            pedidosListaContable,
        }
        res.status(200).json({ mensaje: "Estadisticas", data });
    }
    catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las estadisticas", error });
    }
}

export default obtenerEstadisticas