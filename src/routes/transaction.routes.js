const {Router}=require("express")

const {authMiddleware}=require("../middleware/auth.middleware")
const { authSystemUserMiddleware } = require("../middleware/auth.middleware")
const transactionController=require("../controllers/transaction.controller")

const transactionRoutes=Router()

// post api/transactions
transactionRoutes.post("/", authMiddleware, transactionController.createTransaction)

transactionRoutes.post("/system/initial-funds",authSystemUserMiddleware, transactionController.createIntitialFundsTransaction)

module.exports=transactionRoutes