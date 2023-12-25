import { Router } from "express";
import { verificarAutenticacion, accesoExclusivoAdmin } from "../middlewares/autenticacion.js";
import {
    crearPedido,
    visulizarPedido,
    visulizarPedidos,
} from "../controllers/pedidos.controller.js";
const router = Router();

router.post("/crear-pedido", verificarAutenticacion, crearPedido);
router.get("/visualizar-pedido", verificarAutenticacion, visulizarPedido);
router.get("/visualizar-pedidos", accesoExclusivoAdmin, visulizarPedidos);

export default router;

