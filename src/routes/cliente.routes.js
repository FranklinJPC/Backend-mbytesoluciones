import { Router } from "express";
import verificarAutenticacion from "../middlewares/autenticacion.js";
const router = Router();
import {
    verPerfil,
    actualizarDatos,
    actualizarPassword,
    listarClientes
} from '../controllers/cliente.controller.js';

router.get('/cliente/perfil/:id', verificarAutenticacion, verPerfil)
router.put('/cliente/actualizar/:id', verificarAutenticacion ,actualizarDatos)
router.put('/cliente/actualizarpassword/:id', verificarAutenticacion, actualizarPassword)

// Acceso exclusivo de administrador
router.get('/clientes', verificarAutenticacion, listarClientes)

export default router;