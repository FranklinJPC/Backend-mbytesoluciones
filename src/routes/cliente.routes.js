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
router.put('/cliente/actualizar', verificarAutenticacion ,actualizarDatos)
router.put('/cliente/actualizarpassword', verificarAutenticacion, actualizarPassword)

// Acceso exclusivo de administrador
router.get('/clientes', accesoExclusivoAdmin, listarClientes)

export default router;