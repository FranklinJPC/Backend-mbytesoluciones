import { Router } from "express";
import verificarAutenticacion from "../middlewares/autenticacion.js";
import {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriasDetalles,
    actualizarCategoria,
    eliminarCategoria
} from '../controllers/categoria.controller.js';

const router = Router();

router.post("/categoria/nueva", verificarAutenticacion, crearCategoria);
router.get("/categorias", obtenerCategorias);
router.get("/categoria/detalle/:id", verificarAutenticacion, obtenerCategoriasDetalles);
router.put("/categoria/actualizar/:id", verificarAutenticacion, actualizarCategoria);
router.delete("/categoria/eliminar/:id", verificarAutenticacion, eliminarCategoria);

export default router;