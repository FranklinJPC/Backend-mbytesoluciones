import { Router } from "express";
import {verificarAutenticacion, accesoExclusivoAdmin} from "../middlewares/autenticacion.js";
const router = Router();
import {
    verPerfil,
    actualizarDatos,
    actualizarPassword,
    listarClientes
} from '../controllers/cliente.controller.js';

router.get('/cliente/perfil', verificarAutenticacion, verPerfil)
router.put('/cliente/actualizar/:id', verificarAutenticacion ,actualizarDatos)
router.put('/cliente/actualizarpassword/:id', verificarAutenticacion, actualizarPassword)

// Acceso exclusivo de administrador
router.get('/clientes', accesoExclusivoAdmin, listarClientes)

export default router;