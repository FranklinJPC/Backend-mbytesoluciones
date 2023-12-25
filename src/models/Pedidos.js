import mongoose, { Schema, model } from "mongoose";
const itemPedidoSchema = new Schema({
    producto: {
        type: mongoose.Types.ObjectId,
        ref: "Producto"
    },
    cantidad: {
        type: Number,
        maxlength: 3,
        require: true,
        trim: true,
        default: 0
    },
    precio: {
        type: Number,
        maxlength: 3,
        require: true,
        trim: true,
        default: 0
    },
    total: {
        type: Number,
        maxlength: 3,
        require: true,
        trim: true,
        default: 0
    }
}, {
    timestamps: true
})

const pedidoSchema = new Schema({
    cliente: {
        type: mongoose.Types.ObjectId,
        ref: "Clientes"
    },
    items: [itemPedidoSchema],
    fecha: {
        type: Date,
        require: true,
        trim: true,
        default: Date.now()
    },
    estado: {
        type: String,
        trim: true,
        require: true,
        default: "Pendiente"
    },
    total: {
        type: Number,
        require: true,
        trim: true,
        default: 0
    }
}, {
    timestamps: true
})

export default model("Pedido", pedidoSchema)