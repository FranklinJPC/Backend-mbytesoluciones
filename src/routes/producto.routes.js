import { Router } from "express";
import {verificarAutenticacion} from "../middlewares/autenticacion.js";
const router = Router();
import {
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductos,
    obtenerProducto
} from '../controllers/producto.controllers.js';

router.post("/producto/nuevo", verificarAutenticacion, crearProducto);
router.get("/productos", obtenerProductos);
router.put("/producto/actualizar/:id", verificarAutenticacion, actualizarProducto);
router.delete("/producto/eliminar/:id", verificarAutenticacion, eliminarProducto);
router.get("/producto/detalle/:id", obtenerProducto);

export default router;
