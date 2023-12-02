import { Router } from "express";
const router = Router();
import {
    login,
    registro,
    confirmEmail,
    actualizarPerfil,
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

router.put('/veterinario/actualizarpassword',actualizarPassword)

export default router;  