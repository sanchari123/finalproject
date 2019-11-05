const express=require('express')
const router=express.Router()
const Users=require('../models/user')
const Feedback=require('../models/feedback')
const mongoose=require('mongoose')
const nodemailer=require('nodemailer')
const Package=require('../models/pakageinfo')
router.get('/allOrders',(req,res)=>{
    if(req.session.authenticated)
    {
        Users.findOne({_id:req.session.userid},{myorder:1}).then(result=>{
            if(result.myorder.length){
                res.render('./userpart/myorders',{
                    orders:result,
                    name:req.session.name,
                    authenticated:req.session.authenticated,
                    admin:req.session.admin
                })
            }else{
                res.render('./userpart/myorders',{error:"No data found",
                    name:req.session.name,
                    authenticated:req.session.authenticated,
                    admin:req.session.admin
                })
            }
        }).catch(err=>{
            res.render('./userpart/myorders',{error:err.message,
                name:req.session.name,
                authenticated:req.session.authenticated,
                admin:req.session.admin
            })
        })
    }else{
        res.redirect('/error')
    }
})

router.get('/deleteUser/:id',(req,res)=>{
    if(req.session.admin)
    {
    Users.deleteOne({_id:req.params.id}).then(result=>{
        res.redirect('/admin/allUsers')
    }).catch(err=>{
        res.redirect(`/admin/allUsers/?error=${err.message}`)
    })
}else{
    res.redirect('/error')    
}
})
async function sendmail(email)
{
    try{
        let toemail=email
        let transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
              user:process.env.USER_EMAIL, // generated ethereal user
              pass:process.env.PASSWORD_EMAIL // generated ethereal password
            }
          });
          let info = await transporter.sendMail({
            from:"Adventure World Tourism", // sender address
            to: toemail, // list of receivers
            subject:"Thank you from Adventure World", // Subject line
            text: "Your query or feedback is under process our workers will get back to you soon", // plain text body
          });
          console.log(info)
          if(info)
          {
              return {
                  status:200
              }
          }else{
              return {
                  status:401
              }
          }
        }catch(err)
        {
            console.error(err)
            return {status:401}
        }
}
//user's feedback or contact us form
router.post('/feedback',(req,res)=>{
    if(req.session.authenticated)
    {
    try{
    let email=req.body.email
    let phonenumber=parseInt(req.body.phone)
    let fullname=req.body.name
    let message=req.body.message
    let feedback=new Feedback({
        _id:mongoose.Types.ObjectId(),
        fullname,
        email,
        phonenumber,
        message
    })
    feedback.save()
    .then(async result=>{
        let response=await sendmail(email)
        if(response.status===200)
        {
            res.render('./userpart/feedbackconfirmation',{name:req.session.name,
                authenticated:req.session.authenticated,
                admin:req.session.admin
            })
        }else{
            res.render('./userpart/feedbackconfirmation',{error:"You have given a incorrect email id this would be mellacious",name:req.session.name,
                authenticated:req.session.authenticated,
                admin:req.session.admin
            })
        }
    })
    .catch(err=>{
        res.render('./userpart/feedbackconfirmation',{error:err.message,name:req.session.name,
        authenticated:req.session.authenticated,
        admin:req.session.admin
    })
    })
}catch(err)
{
    res.redirect('/error')
}
    }else{
        res.redirect('/error')
    }
})

router.get('/paywithpaytm/:pid',(req,res)=>{
    Package.findOne({_id:req.params.pid},{amount:1}).then(result=>{
        res.redirect(`https://bookbasement.herokuapp.com/paywithpaytm?amount=${result.amount}`)
    }).catch(err=>{
        res.redirect('/user/allOrders')
    })
})

module.exports=router