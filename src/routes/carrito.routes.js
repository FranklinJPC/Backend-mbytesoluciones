import { Router } from "express";
import { verificarAutenticacion } from "../middlewares/autenticacion.js";
import {
    aniadirProductos,
    vaciarCarrito,
    verCarrito,
    eliminarProducto,
    actulizarCantidad
} from "../controllers/carrito.compras.controller.js";

const router = Router();

// Rutas para el carrito de compras
router.post("/carrito/agregar", verificarAutenticacion, aniadirProductos);
router.delete("/carrito/eliminar", verificarAutenticacion, vaciarCarrito);
router.get("/carrito/detalle", verificarAutenticacion, verCarrito);
router.delete("/carrito/eliminar-producto/:id", verificarAutenticacion, eliminarProducto);
router.put("/carrito/actualizar-cantidad/:id", verificarAutenticacion, actulizarCantidad);


export default router;