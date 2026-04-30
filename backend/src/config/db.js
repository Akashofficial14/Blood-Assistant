const mongoose=require("mongoose")

const connectDB=async()=>{
    try {
        let res=await mongoose.connect(process.env.MONGO_URI)
        if(res){
            console.log("MongoDB connected")
        }
    } catch (error) {
        console.log("error while connecting MongoDB")
    }
}
module.exports=connectDB