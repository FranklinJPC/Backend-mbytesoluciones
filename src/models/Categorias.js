import { Schema, model } from "mongoose";
const categoriaSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    descripcion: {
        type: String,
        require: true,
        trim: true
    }
}, {
    timestamps: true
})

export default model("Categoria", categoriaSchema);