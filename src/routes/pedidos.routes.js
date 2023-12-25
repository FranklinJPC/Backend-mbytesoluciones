import { Router } from "express";
import { verificarAutenticacion, accesoExclusivoAdmin } from "../middlewares/autenticacion.js";
import {
    crearPedido,
    visulizarPedido,
    visulizarPedidos,
    actualizarPedido
} from "../controllers/pedidos.controller.js";
const router = Router();

// Clientes
router.post("/crear-pedido", verificarAutenticacion, crearPedido);
router.get("/visualizar-pedido", verificarAutenticacion, visulizarPedido);

// Admin
router.get("/visualizar-pedidos", accesoExclusivoAdmin, visulizarPedidos);
router.put("/actualizar-pedido-estado/:id", accesoExclusivoAdmin, actualizarPedido);

export default router;

