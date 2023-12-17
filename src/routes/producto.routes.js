import { Router } from "express";
import {verificarAutenticacion, accesoExclusivoAdmin} from "../middlewares/autenticacion.js";
const router = Router();
import {
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductos,
    obtenerProducto
} from '../controllers/producto.controllers.js';

router.post("/producto/nuevo", accesoExclusivoAdmin, crearProducto);
router.get("/productos", obtenerProductos);
router.put("/producto/actualizar/:id", accesoExclusivoAdmin, actualizarProducto);
router.delete("/producto/eliminar/:id", accesoExclusivoAdmin, eliminarProducto);
router.get("/producto/detalle/:id", obtenerProducto);

export default router;
