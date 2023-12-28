import mongoose, { Schema, model } from "mongoose";

const itemCarritoSchema = new Schema({
    id_producto: {
        type: mongoose.Types.ObjectId,
        ref: "Producto"
    },
    cantidad: {
        type: Number,
        trim: true,
        default: 0
    },
    precio: {
        type: Number,
        trim: true,
        default: 0
    },
    total: {
        type: Number,
        trim: true,
        default: 0
    }
}, {
    timestamps: true
})

const carritoSchema = new Schema({
    id_cliente: {
        type: mongoose.Types.ObjectId,
        ref: "Clientes"
    },
    items: [itemCarritoSchema],
    subtotal: {
        type: Number,
        trim: true,
        default: 0
    },
    estado: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
})


export default model("Carrito", carritoSchema);
