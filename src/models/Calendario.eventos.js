import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const calendarioEventosSchema = new Schema({
    titulo: {
        type: String,
        required: [true, "El título es obligatorio"],
    },
    descripcion: {
        type: String,
        required: [true, "La descripción es obligatoria"],
    },
    fecha_inicio: {
        type: Date,
        required: [true, "La fecha de inicio es obligatoria"],
    },
    fecha_fin: {
        type: Date,
        required: [true, "La fecha de fin es obligatoria"],
    },
    hora_inicio: {
        type: String,
        required: [true, "La hora de inicio es obligatoria"],
    },
    hora_fin: {
        type: String,
        required: [true, "La hora de fin es obligatoria"],
    },
},
{
    timestamps: true,
});


export default model("CalendarioEventos", calendarioEventosSchema);