const express=require('express')
const router=express.Router()
const multer  = require('multer')
const storagestrategy=require('../strategies/photoupload')
const upload = multer({storage:storagestrategy.strategy}).array('photos',process.env.numberupload)
const adminController=require('../controller/admin')
const Package=require('../models/pakageinfo')
const Feedback=require('../models/feedback')

//admin page render of package creation
router.get('/packageupload',(req,res)=>{
    if(req.session.admin)
    {
        res.render('./adminpart/packagecreate',
        {
            admin:req.session.admin,
            name:req.session.name,
            authenticated:req.session.authenticated,
            error:req.query.error
        }
    )
    }else{
        res.render('./error/error')
    }
})
//admin uploads
router.post('/package/uploads',function(req,res,next){
    upload(req,res,function(err){
        if(err instanceof multer.MulterError)
        {
            res.redirect('/admin/packageupload/?error=something went wrong while uploading the image')
        }else if(err)
        {
            res.redirect('/admin/packageupload/?error=something went wrong while uploading the image')
        }
        else{
            next()
        }
    })
},adminController.adminController)

//all users
router.get('/allUsers',adminController.fetchAllUsers,(req,res)=>{
    if(req.session.admin)
    {
        if(req.error)
        {
            res.render('./adminpart/allUsers',{error:req.error,
                admin:req.session.admin,
                name:req.session.name,
                authenticated:req.session.authenticated,
            })
        }else{
            if(req.users)
            {
                res.render('./adminpart/allUsers',{users:req.users,
                    admin:req.session.admin,
                    name:req.session.name,
                    authenticated:req.session.authenticated
                })
            }else{
                res.render('./adminpart/allUsers',{error:"Something went wrong",
                admin:req.session.admin,
                name:req.session.name,
                authenticated:req.session.authenticated
            })
            }
        }
    }else{
        res.render('./error/error')
    }
})
//allpackages without orders
router.get('/allPackages',adminController.fetchAllPackages,(req,res)=>{
    if(req.session.admin)
    {
    if(req.error)
    {
        if(!req.query.error)
        res.render('./adminpart/allpackages',{error:req.error,
            admin:req.session.admin,
            name:req.session.name,
            authenticated:req.session.authenticated
        })
        else
        res.render('./adminpart/allpackages',{error:req.query.error,
            admin:req.session.admin,
            name:req.session.name,
            authenticated:req.session.authenticated
        })
    }else{
        res.render('./adminpart/allpackages',{package:req.package,
            admin:req.session.admin,
            name:req.session.name,
            authenticated:req.session.authenticated
        })
    }
}else{
    res.redirect('/error')
}
})

//get all booking coressponding to a package
router.get('/bookings/:pid',(req,res)=>{
    if(req.session.admin)
    {
    let pid=req.params.pid
    Package.findOne({_id:pid},{bookingDone:1,tid:1,name:1}).then(result=>{
        res.render('./adminpart/bookings',{bookingData:result,admin:req.session.admin,
            name:req.session.name,
            authenticated:req.session.authenticated
        })
    }).catch(err=>{
        res.render('./adminpart/bookings',{error:err.message,admin:req.session.admin,
            name:req.session.name,
            authenticated:req.session.authenticated
        })
    })
}else{
    res.redirect('/error')
}
})

router.get('/feedback',(req,res)=>{
    if(req.session.admin)
    {
    Feedback.find({}).then(result=>{
        if(result.length!==0)
        {
            res.render('./adminpart/feedback',{feedback:result,
                admin:req.session.admin,
                name:req.session.name,
                authenticated:req.session.authenticated})
        }else{
            res.render('./adminpart/feedback',{error:"No data found",
                admin:req.session.admin,
                name:req.session.name,
                authenticated:req.session.authenticated})
        }
    }).catch(err=>{
        res.render('./adminpart/feedback',{error:err.message,
            admin:req.session.admin,
            name:req.session.name,
            authenticated:req.session.authenticated})
    })
}else{
    res.redirect('/error')
}
})

router.get('/search/tid',(req,res)=>{
    if(req.session.admin)
    {
    res.render('./adminpart/searchtid',{package:[],
        admin:req.session.admin,
        name:req.session.name,
        authenticated:req.session.authenticated
    })
}else{
    res.redirect('/error')
}
})
//router for tid search
router.post('/search/tid',(req,res)=>{
    if(req.session.admin)
    {
    Package.find({tid:req.body.tid}).then(result=>{
        if(result.length!==0)
        res.render('./adminpart/searchtid',{package:result,
            admin:req.session.admin,
            name:req.session.name,
            authenticated:req.session.authenticated
        })
        else
        res.render('./adminpart/searchtid',{error:"No data found",
            admin:req.session.admin,
            name:req.session.name,
            authenticated:req.session.authenticated
        })
    }).catch(err=>{
        res.render('./adminpart/searchtid',{error:err.message,
            admin:req.session.admin,
            name:req.session.name,
            authenticated:req.session.authenticated
        })
    })
}else{
    res.redirect('/error')
}
})

router.get('/delete/package/:pid',(req,res)=>{
    Package.deleteOne({_id:req.params.pid}).then(result=>{
        res.redirect('/admin/allPackages')
    }).catch(err=>{
        res.redirect(`/admin/allPackages/?error=${err.message}`)
    })
})
module.exports=router