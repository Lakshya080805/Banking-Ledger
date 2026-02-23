const mongoose = require('mongoose');

const transactionSchema=new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"From account reference is required"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"To account reference is required"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED"],
            meessage:"Status must be either PENDING, COMPLETED, or FAILED"
    },
    default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required"],
        min:[0,"transaction amount cannot be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"Idempotency key is required"],  
        index:true,
        unique:true
    }
},{
    timestamps:true
})

const transactionModel=mongoose.model("transaction",transactionSchema)

module.exports=transactionModel