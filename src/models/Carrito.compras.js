import mongoose, { Schema, model } from "mongoose";
const carritoSchema = ({
    id_cliente: {
        type: mongoose.Types.ObjectId,
        ref: "Clientes"
    }
}, {
    timestamps: true
})

export default model("Carrito", carritoSchema);