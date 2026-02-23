


const mongoose = require("mongoose")

function connectToDB(){
    if(!process.env.MONGO_URI){
        console.error("MONGO_URI is not defined")
        process.exit(1)
    }

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to MongoDB")
    })
    .catch((err)=>{
        console.error("MongoDB Connection Error:", err)
        process.exit(1)
    })
}

module.exports = connectToDB
