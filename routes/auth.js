const express=require('express')
const router=express.Router()
const authController=require('../controller/auth')
//route for signup here
router.post('/signup',authController.checkDuplicateEmail,authController.signUpController,(req,res)=>{
    if(req.info!==null && req.error===null)
    res.redirect('/user/userlogin')
    if(req.error!==null)
    {
        res.redirect(`/user/userreg/?error=${req.error}`)
    }
})
//login route
router.post('/login',authController.loginController)
module.exports=router