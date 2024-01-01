import { Router } from "express";
import { accesoExclusivoAdmin } from "../middlewares/autenticacion.js";
import {
    crearEvento,
    verEventos,
    verEvento,
    actualizarEvento,
    eliminarEvento
} from "../controllers/calendario.controller.js";
const router = Router();
// Rutas para el calendario
router.post("/calendario/crear-evento", accesoExclusivoAdmin, crearEvento);
router.get("/calendario/ver-eventos", accesoExclusivoAdmin, verEventos);
router.get("/calendario/ver-evento/:id", accesoExclusivoAdmin, verEvento);
router.put("/calendario/actualizar-evento/:id", accesoExclusivoAdmin, actualizarEvento);
router.delete("/calendario/eliminar-evento/:id", accesoExclusivoAdmin, eliminarEvento);

export default router;