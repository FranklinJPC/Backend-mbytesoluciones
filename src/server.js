import Express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from "express-fileupload";
import routeUsuarios from './routes/usuario.routes.js';
import routeProductos from './routes/producto.routes.js';
import routeCategorias from './routes/categoria.routes.js';
import routeClientes from './routes/cliente.routes.js';
import routeCarrito from './routes/carrito.routes.js';
import routePedidos from './routes/pedidos.routes.js';
import routeCalendario from './routes/calendario.routes.js';
import cron from "./helpers/verificarBD.js";
import routerEstadiscticas from "./routes/estadisticas.routes.js";

const app = Express();
dotenv.config();

app.set('port', process.env.PORT || 3003);
app.use(cors())

app.use(Express.json())

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
}))

// Iniciar cron
// cron.getTasks();


app.get('/', (req, res) => {res.status(200).json({msg: "Servidor Encendido"})});
// Rutass
app.use('/api', routeUsuarios);
app.use('/api', routeProductos);
app.use('/api', routeCategorias);
app.use('/api', routeClientes);
app.use('/api', routeCarrito);
app.use('/api', routePedidos);
app.use('/api', routeCalendario);
app.use('/api', routerEstadiscticas);

app.use((req, res) => {res.status(404).json({msg: "Ruta no encontrada"})});

export default app

