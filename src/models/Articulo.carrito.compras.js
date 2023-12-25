import CarritoCompras from "./Carrito.compras.js";
const carrito = async () => {
    const carrito = await CarritoCompras.find().populate({
        path: "items.id_producto",
        select: "nombre precio_venta total"
    })
    return carrito[0];
}
const agregarProducto = async carga => {
    const nuevoProducto = await CarritoCompras.create(carga);
    return nuevoProducto;
}

export {
    carrito,
    agregarProducto
}