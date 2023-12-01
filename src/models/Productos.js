import mongoose, { Schema, model } from "mongoose";
const productoSchema = ({
    nombre: {
        type: String,
        trim: true,
        require: true
    },
    descripcion: {
        type: String,
        trim: true,
    },
    precio: {
        type: Number,
        trim: true,
        default: 0,
        require: true
    },
    cantidad: {
        type: Number,
        trim: true,
        require: true,
        default: 0
    },
    categoria: {
        type: mongoose.Types.ObjectId,
        ref: "Categoria"
    },

}, {
    timestamps: true
})

export default model("Producto", productoSchema)