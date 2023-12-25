import { Router } from "express";
import { verificarAutenticacion } from "../middlewares/autenticacion.js";
import {
    aniadirProductos,
    vaciarCarrito,
    verCarrito,
    eliminarProducto
} from "../controllers/carrito.compras.controller.js";

const router = Router();

router.post("/carrito/agregar", verificarAutenticacion, aniadirProductos);
router.delete("/carrito/eliminar", verificarAutenticacion, vaciarCarrito);
router.get("/carrito/detalle", verificarAutenticacion, verCarrito);
router.delete("/carrito/eliminar-producto/:id", verificarAutenticacion, eliminarProducto);


export default router;