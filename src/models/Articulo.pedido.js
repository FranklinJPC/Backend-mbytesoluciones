import mongoose, { Schema, model } from "mongoose";
const articuloPedidoSchema = ({
    id_pedido: {
        type: mongoose.Types.ObjectId,
        ref: "Pedido"
    },
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
    Imagen:{
        public_id:String,
        secure_url:String
    },
    disponibilidad: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export default articuloPedidoSchema("ArtPedido", articuloPedidoSchema)