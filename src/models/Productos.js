import mongoose, { Schema, model } from "mongoose";
const productoSchema = new Schema({
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
    precio_venta:{
        type: Number,
        trim: true,
        default: 0,
        require: true
    },
    marca: {
        type: String,
        trim: true,
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
        ref: "Categoria",
        require: true
    },
    fecha_ingreso: {
        type: Date,
        default: Date.now
    },

}, {
    timestamps: true
})

export default model("Producto", productoSchema)