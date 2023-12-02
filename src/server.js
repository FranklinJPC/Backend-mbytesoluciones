import Express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import routeUsuarios from './routes/usuario.routes.js';

const app = Express();
dotenv.config();

app.set('port', process.env.PORT || 3003);
app.use(cors())

app.use(Express.json())

app.get('/', (req, res) => {res.status(200).json({msg: "Servidor Encendido"})});
// Rutass
app.use('/api', routeUsuarios);

app.use((req, res) => {res.status(404).json({msg: "Ruta no encontrada"})});

export default app

