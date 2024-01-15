import { Router } from "express";
import {accesoExclusivoAdmin} from "../middlewares/autenticacion.js";
import obtenerEstadisticas from "../controllers/estadisticas.controllers.js";
const router = Router();

// Rutas para las estadisticas
router.get("/estadisticas", accesoExclusivoAdmin, obtenerEstadisticas);

export default router;