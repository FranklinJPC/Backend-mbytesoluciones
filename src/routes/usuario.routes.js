import { Router } from "express";
import verificarAutenticacion from "../middlewares/autenticacion.js";
const router = Router();
import {
    login,
    registro,
    confirmEmail,
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


export default router;  