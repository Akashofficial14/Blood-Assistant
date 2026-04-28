const mongoose=require("mongoose")

const connectDB=async()=>{
    try {
        let res=await mongoose.connect("mongodb://localhost:27017/blood-assistant")
        if(res){
            console.log("MongoDB connected")
        }
    } catch (error) {
        console.log("error while connecting MongoDB")
    }
}
module.exports=connectDB