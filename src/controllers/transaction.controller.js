const transactionModel=require("../models/transaction.model")
const ledgerModel=require("../models/ledger.model")
const accountModel=require("../models/account.model")
const emailService=require("../services/email.service")
const mongoose=require("mongoose")


async function createTransaction(req,res){

    // 1.validate request body

    const {fromAccount,toAccount,amount,idempotencyKey}=req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"Missing required fields: fromAccount, toAccount, amount, idempotencyKey"
        })
    }

    const fromUserAccount=await accountModel.findOne({
        _id:fromAccount,
    })
    const toUserAccount=await accountModel.findOne({
        _id:toAccount,
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"One or both accounts not found"
        })
    }

    // 2. validate idempotency key

    const isTransactionAlreadyExist=await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionAlreadyExist){
        if(isTransactionAlreadyExist.status==="COMPLETED"){
            return res.status(200).json({
                message:"Transaction already processed",
                transaction:isTransactionAlreadyExist
            })
        }

        if(isTransactionAlreadyExist.status==="PENDING"){
            return res.status(200).json({
                message:"Transaction is still pending"
            })
        }
        if(isTransactionAlreadyExist.status==="FAILED"){
            return res.status(500).json({
                message:"Previous transaction attempt failed, you can retry"
            })
        }

        if(isTransactionAlreadyExist.status==="REVERSED"){
            return res.status(500).json({
                message:"Transaction has been reversed"
            })
        }
    }

    //3. check acc status

    if(fromUserAccount.status!=="ACTIVE" || toUserAccount.status!=="ACTIVE"){
        return res.status(400).json({
            message:"Both accounts must be active to process the transaction"
        })
    }

    // 4. check sufficient balance of sender from ledger
    
    const balance=await fromUserAccount.getBalance()

    if(balance<amount){
        return res.status(400).json({
            message:`Insufficient balance. Available balance is ${balance}.Required balance is ${amount}`
        })
    }

    

 
    // 5. create transaction with status pending
    let transaction;
try{
    const session=await mongoose.startSession()
    session.startTransaction()

    transaction=(await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }],{session}))[0]

    // 6. create debit ledger entry

 const debitLedgerEntry=await ledgerModel.create([{
    account:fromAccount,
    transaction:transaction._id,
    amount:amount,
    type:"DEBIT"
 }],{session})

   await (()=>{
      return new Promise((resolve)=>setTimeout(resolve,15*1000))
   })()

 // 7. create credit ledger entry

 const creditLedgerEntry=await ledgerModel.create([{
    account:toAccount,
    transaction:transaction._id,
    amount:amount,
    type:"CREDIT"
 }],{session})

 // 8. mark transaction as completed

//  transaction.status="COMPLETED"
//  await transaction.save({session})

await transactionModel.findOneAndUpdate(
    {_id:transaction._id},
    {status:"COMPLETED"},
    {session}
)

 // 9. commit transaction
 await session.commitTransaction()
 session.endSession()

    }
    catch(error){
        return res.status(400).json({
            message:"Error processing transaction"
        })
    }

 // 10. send email notification to both sender and receiver

await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toUserAccount.accountNumber)

return res.status(200).json({
    message:"Transaction processed successfully",
    transaction:transaction
})

}

async function createIntitialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey}=req.body

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"Missing required fields: toAccount, amount, idempotencyKey"
        })
    }

    const toUserAccount=await accountModel.findOne({
        _id:toAccount,
    })

    if(!toUserAccount){
        return res.status(400).json({
            message:"Account not found"
        })
    }

    const fromUserAccount=await accountModel.findOne({
        systemUser:true, 
        user:req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user account not found"
        })
    }

    const session=await mongoose.startSession()
    session.startTransaction()

    const transaction=new transactionModel({
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })

    // 6. create debit ledger entry

 const debitLedgerEntry=await ledgerModel.create([{
    account:fromUserAccount._id,
    transaction:transaction._id,
    amount:-amount,
    type:"DEBIT"
 }],{session})

 // 7. create credit ledger entry

 const creditLedgerEntry=await ledgerModel.create([{
    account:toUserAccount._id,
    transaction:transaction._id,
    amount:amount,
    type:"CREDIT"
 }],{session})

 transaction.status="COMPLETED"
 await transaction.save({session})

 await session.commitTransaction()
 session.endSession()

 return res.status(201).json({
    message:"Initial funds transaction created successfully",
    transaction:transaction
 })

}

module.exports={
    createTransaction,
    createIntitialFundsTransaction
}