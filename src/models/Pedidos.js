import mongoose, { Schema, model } from "mongoose";
const itemPedidoSchema = new Schema({
    id_producto: {
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
    domicilio: {
        type: Boolean,
        trim: true,
        default: false,
        require: [true, "El domicilio es obligatorio"]
    },
    observaciones: {
        type: String,
        trim: true,
        default: "Sin observaciones"
    },
    forma_pago: {
        type: String,
        trim: true,
        require: [true, "La forma de pago es obligatoria"]
    },
    fecha: {
        type: Date,
        require: true,
        trim: true,
        default: Date.now()
    },
    fecha_finalizada: {
        type: Date,
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