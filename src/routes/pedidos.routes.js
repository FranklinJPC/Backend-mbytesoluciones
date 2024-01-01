import { Router } from "express";
import { verificarAutenticacion, accesoExclusivoAdmin } from "../middlewares/autenticacion.js";
import {
    crearPedido,
    visulizarPedido,
    visulizarPedidos,
    actualizarPedido,
    historialPedidos
} from "../controllers/pedidos.controller.js";
const router = Router();

// Clientes
router.post("/crear-pedido", verificarAutenticacion, crearPedido);
// id del pedido
router.get("/visualizar-pedido/:id", verificarAutenticacion, visulizarPedido);
router.get("/historial-pedidos", verificarAutenticacion, historialPedidos);

// Admin
router.get("/visualizar-pedidos", accesoExclusivoAdmin, visulizarPedidos);
// id del pedido
router.put("/actualizar-pedido-estado/:id", accesoExclusivoAdmin, actualizarPedido);

export default router;

