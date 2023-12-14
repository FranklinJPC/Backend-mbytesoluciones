import { Router } from "express";
import { verificarAutenticacionAdmin } from "../middlewares/autenticacion.js";
import {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasDetalles,
    actualizarCategoria,
    eliminarCategoria
} from '../controllers/categoria.controller.js';

const router = Router();

router.post("/categoria/nueva", verificarAutenticacionAdmin, crearCategoria);
router.get("/categorias", obtenerCategorias);
router.get("/categoria/detalle/:id", verificarAutenticacionAdmin, obtenerCategoriasDetalles);
router.put("/categoria/actualizar/:id", verificarAutenticacionAdmin, actualizarCategoria);
router.delete("/categoria/eliminar/:id", verificarAutenticacionAdmin, eliminarCategoria);

export default router;