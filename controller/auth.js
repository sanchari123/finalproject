const User=require('../models/user')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')


exports.signUpController=(req,res,next)=>{
    try{
        let email=req.body.email
        let password=req.body.password
        let name=req.body.fullname
        let phonenumber=req.body.mobileno
        let country=req.body.country
        let gender=req.body.gender
        let address=req.body.address
        bcrypt.hash(password,10,(err,hash)=>{
            if(err)
            {
                res.render('./userpart/userreg',{error:err.message})
            }
            else{
                const user=new User({
                    _id: mongoose.Types.ObjectId(),
                    email: email,
                    password:hash,
                    fullname: name,
                    recvisit:[],
                    mostvisit:[],
                    carts:[],
                    addressLine:address,
                    phonenumber:phonenumber,
                    country:country,
                    gender:gender
                })
                user.save()
                .then((result)=>{
                    req.info=result
                    req.error=null
                    next()
                }).catch(err=>{
                    req.info=null
                    req.error=err
                    next()
                })
            }
        })
    }catch(err){
        req.info=null
        req.error=err
    }
}


exports.checkDuplicateEmail=(req,res,next)=>{
    try{
        User.find({email:req.body.email}).then(result=>{
            if(result.length!==0)
            {
                res.redirect('/user/userreg/?error=Useremail already exists')
            }else{
                next()
            }
        }).catch(err=>{
            res.render(`/userpart/userreg/?error=something goes wrong`)            
        })
    }
    catch(err)
    {
        res.render(`/user/userreg/?error=Internal server error`)        
    }
}


exports.loginController=(req,res,next)=>{
    let email=req.body.email
    let password=req.body.password
    let errormsg="give right credential"
    if(email && password)
    {
        User.find({email}).then(result=>{
            if(result.length!==0)
            {
                bcrypt.compare(password,result[0].password,(err,response)=>{
                    if(response)
                    {
                        req.session.authenticated=true
                        req.session.name=result[0].fullname
                        req.session.userid=result[0]._id
                        if(result[0].email===process.env.admin)
                        {
                            req.session.admin=true
                        }else{
                            req.session.admin=false
                        }
                        res.redirect(`/`)
                    }
                    else{
                        res.redirect(`/user/userlogin/?error=${errormsg}`)
                    }
                })
            }
            else{
                res.redirect(`/user/userlogin/?error=${errormsg}`)                   
            }
        }).catch(err=>{
            res.redirect(`/user/userlogin/?error=${errormsg}`)               
        })
    }else{
        res.redirect(`/user/userlogin/?error=${errormsg}`)           
    }
}