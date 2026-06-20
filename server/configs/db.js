import mongoose from "mongoose";
import dns from "dns";

// Use Google's public DNS to resolve MongoDB Atlas SRV records
// (some ISP DNS servers fail to resolve SRV records)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async ()=>{
    try{
        mongoose.connection.on("connected",()=>{
            console.log("MongoDB connected successfully");
        })
        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder';
        if(!mongodbURI){
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0,-1);
        }
        await mongoose.connect(`${mongodbURI}/${projectName}`)
    }catch(error){
        console.log("Error connecting to MongoDB:",error);
    }
}

export default connectDB;