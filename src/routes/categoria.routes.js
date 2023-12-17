import { Router } from "express";
import {verificarAutenticacion, accesoExclusivoAdmin} from "../middlewares/autenticacion.js";
import {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasDetalles,
    actualizarCategoria,
    eliminarCategoria
} from '../controllers/categoria.controller.js';

const router = Router();

router.post("/categoria/nueva", accesoExclusivoAdmin, crearCategoria);
router.get("/categorias", obtenerCategorias);
router.get("/categoria/detalle/:id", verificarAutenticacion, obtenerCategoriasDetalles);
router.put("/categoria/actualizar/:id", accesoExclusivoAdmin, actualizarCategoria);
router.delete("/categoria/eliminar/:id", accesoExclusivoAdmin, eliminarCategoria);

export default router;