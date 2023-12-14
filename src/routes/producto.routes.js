import { Router } from "express";
import { verificarAutenticacionAdmin } from "../middlewares/autenticacion.js";
const router = Router();
import {
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductos,
    obtenerProducto
} from '../controllers/producto.controllers.js';

router.post("/producto/nuevo", verificarAutenticacionAdmin, crearProducto);
router.get("/productos", obtenerProductos);
router.put("/producto/actualizar/:id", verificarAutenticacionAdmin, actualizarProducto);
router.delete("/producto/eliminar/:id", verificarAutenticacionAdmin, eliminarProducto);
router.get("/producto/detalle/:id", obtenerProducto);

export default router;
