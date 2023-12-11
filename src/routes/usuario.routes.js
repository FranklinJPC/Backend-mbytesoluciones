import { Router } from "express";
import { verificarAutenticacionCliente } from "../middlewares/autenticacion.js";
const router = Router();
import {
    login,
    registro,
    confirmEmail,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword
} from '../controllers/usuario.controller.js';

router.post("/login", login);
router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

router.put('/usuario/actualizarpassword', verificarAutenticacionCliente, actualizarPassword)

export default router;  