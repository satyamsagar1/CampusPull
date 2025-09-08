import mongoose from "mongoose";

export async function conectDB(){
    const uri = process.env.MONGODB_URI;
    if(!uri) throw new Error("MONGO_URI is not defined in .env file");

    mongoose.set('strictQuery', true);
    await mongoose.connect(uri,{maxPoolSize: 10,autoIndex:true });
    console.log("MongoDB connected");
}