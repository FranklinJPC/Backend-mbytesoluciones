import Pedidos from "./Pedidos.js";
const pedido = async () => {
    const pedido = await Pedidos.find().populate({
        path: "items.id_producto",
        select: "nombre precio_venta total imagen"
    })
    return pedido;
}
const agregarPedido = async pedido => {
    const nuevoPedido = await Pedidos.create(pedido);
    return nuevoPedido;
}

export {
    pedido,
    agregarPedido
}