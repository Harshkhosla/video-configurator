import mongoose from "mongoose"
const mongoURI = 'mongodb+srv://harsh:Harsh9945khosla@cluster0.osfevs6.mongodb.net/SecondBrain'

const Database =async ()=>{
    try{
        await mongoose.connect(mongoURI)
        console.log("Mongo Db Connected")

    }catch(e){
        console.error('Error connecting to MongoDB:', e);
    
    }

}

export const ConnectToMongo = Database;