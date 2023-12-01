import mongoose, { Schema, model } from "mongoose";
const artCarritoSchema = ({
    id_carrito: {
        type: mongoose.Types.ObjectId,
        ref: "Carrito"
    },
    id_producto: {
        type: mongoose.Types.ObjectId,
        ref: "Producto"
    },
    cantidad: {
        type: Number,
        trim: true,
        default: 0
    }
}, {
    timestamps: true
})

export default model("ArtCarrito", artCarritoSchema)