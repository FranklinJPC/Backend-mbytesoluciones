import { Router } from "express";
import {verificarAutenticacion, accesoExclusivoAdmin} from "../middlewares/autenticacion.js";
const router = Router();
import {
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductos,
    obtenerProducto,
    crearImagenPrueba,
    obtenerProductosPorMarcas
} from '../controllers/producto.controllers.js';

router.post("/producto/nuevo", accesoExclusivoAdmin, crearProducto);
router.get("/productos", obtenerProductos);
router.put("/producto/actualizar/:id", accesoExclusivoAdmin, actualizarProducto);
router.delete("/producto/eliminar/:id", accesoExclusivoAdmin, eliminarProducto);
router.get("/producto/detalle/:id", obtenerProducto);
router.get("/productos/marcas", obtenerProductosPorMarcas);

// Pruebas
router.post("/producto/imagen", accesoExclusivoAdmin, crearImagenPrueba)

export default router;
