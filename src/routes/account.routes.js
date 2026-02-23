const express=require("express")
const {authMiddleware}=require("../middleware/auth.middleware")
const accountController=require("../controllers/account.controller")




const router=express.Router()


// POST /api/accounts/ - Create a new account

router.post("/create",authMiddleware,accountController.createAccountController)


// get account details

router.get("/",authMiddleware,accountController.getAccountDetailsController)


//  get /api/accounts/balance/:accountId 

router.get("/balance/:accountId",authMiddleware,accountController.getAccountBalanceController)

module.exports=router