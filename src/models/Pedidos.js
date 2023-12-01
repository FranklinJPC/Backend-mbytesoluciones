import mongoose, { Schema, model } from "mongoose";
const pedidoSchema = ({
    cliente: {
        type: mongoose.Types.ObjectId,
        ref: "Clientes"
    },
    fecha: {
        type: Date,
        require: true,
        trim: true
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