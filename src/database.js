import mongoose from "mongoose";
mongoose.set('strictQuery', true)

const connection = async()=>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log(`Base conectada: ${connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

export default connection