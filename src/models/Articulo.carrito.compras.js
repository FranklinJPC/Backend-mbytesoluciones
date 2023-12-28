import CarritoCompras from "./Carrito.compras.js";
const carrito = async cliente => {
    const carrito = await CarritoCompras.findOne({ id_cliente: cliente }).populate({
        path: "items.id_producto",
        select: "nombre precio_venta total imagen"
    }).select("-__v -updatedAt -createdAt");
    return carrito;
}
const agregarProducto = async carga => {
    const nuevoProducto = await CarritoCompras.create(carga);
    return nuevoProducto;
}

export {
    carrito,
    agregarProducto
}