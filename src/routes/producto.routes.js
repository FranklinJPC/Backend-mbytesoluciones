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

router.post("/producto/nuevo", crearProducto);
router.get("/productos", obtenerProductos);
router.put("/producto/actualizar/:id", actualizarProducto);
router.delete("/producto/eliminar/:id", eliminarProducto);
router.get("/producto/detalle/:id", obtenerProducto);

export default router;
