import CalendarioEventos from "../models/Calendario.eventos.js";

const crearEvento = async (req, res) => {
    const { titulo, descripcion, fecha_inicio, fecha_fin, hora_inicio, hora_fin } = req.body;
    try {
        const eventoBD = await CalendarioEventos.create({
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            hora_inicio,
            hora_fin
        });
        res.status(200).json({ mensaje: "Evento creado con éxito", eventoBD });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear el evento", error });
    }
}

const verEventos = async (req, res) => {
    try {
        const eventosBD = await CalendarioEventos.find();
        if (eventosBD.length === 0) return res.status(400).json({ mensaje: "No hay eventos" });
        res.status(200).json({ mensaje: "Eventos", eventosBD });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al ver los eventos", error });
    }
}

const verEvento = async (req, res) => {
    try{
        const eventoBD = await CalendarioEventos.findById(req.params.id);
        if (!eventoBD) return res.status(400).json({ mensaje: "No existe el evento" });
        res.status(200).json({ mensaje: "Evento", eventoBD }); 
    }
    catch(error){
        res.status(400).json({ mensaje: "Error al ver el evento", error });
    }
}

const actualizarEvento = async (req, res) => {
    const { titulo, descripcion, fecha_inicio, fecha_fin, hora_inicio, hora_fin } = req.body;
    try{
        const eventoBD = await CalendarioEventos.findByIdAndUpdate(req.params.id, {
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            hora_inicio,
            hora_fin
        });
        res.status(200).json({ mensaje: "Evento actualizado con éxito", eventoBD });
    }
    catch(error){
        res.status(400).json({ mensaje: "Error al actualizar el evento", error });
    }
}

const eliminarEvento = async (req, res) => {
    try{
        const eventoBD = await CalendarioEventos.findByIdAndDelete(req.params.id);
        res.status(200).json({ mensaje: "Evento eliminado con éxito", eventoBD });
    }
    catch(error){
        res.status(400).json({ mensaje: "Error al eliminar el evento", error });
    }
}

export {
    crearEvento,
    verEventos,
    verEvento,
    actualizarEvento,
    eliminarEvento
}