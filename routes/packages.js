const express=require('express')
const router=express.Router()
const packageController=require('../controller/packages')
const User=require('../models/user')
const Package=require('../models/pakageinfo')

//package searching
router.post('/search',(req,res)=>{
    if(req.session.authenticated)
    {
    let sstring=req.body.searchstring.toUpperCase()
    Package.find({name:{$regex:sstring}}).then(result=>{
        if(result.length!==0)
        res.render('./userpart/searcheditems',{package:result,name:req.session.name,
            authenticated:req.session.authenticated,
            admin:req.session.admin
        })
        else
        res.render('./userpart/searcheditems',{error:"No data found",name:req.session.name,
        authenticated:req.session.authenticated,
        admin:req.session.admin
    })
    }).catch(err=>{
        res.redirect('./userpart/searcheditems',{error:err.message,name:req.session.name,
            authenticated:req.session.authenticated,
            admin:req.session.admin
        })
    })
}else{
    res.redirect('/error')
}
})


//getting all packages
router.get('/all/packages',packageController.fetchAllPackages,(req,res)=>{
    if(req.session.authenticated)
    {
        if(req.error)
        {
            res.render('./userpart/allpackages',{
                error:req.error,
                name:req.session.name,
                authenticated:req.session.authenticated,
                admin:req.session.admin
            })
        }else if(req.packages)
        {
            res.render('./userpart/allpackages',{packages:req.packages,name:req.session.name,
                authenticated:req.session.authenticated,
                admin:req.session.admin
            })
        }else{
            res.render('./userpart/allpackages',{error:"Something goes wrong in server",name:req.session.name,
            authenticated:req.session.authenticated,
            admin:req.session.admin
        })
        }
    }else{
        res.redirect('/error')
    }
})
//getting particular package
router.get('/:pid',packageController.fetchOnePackage,(req,res)=>{
    if(req.session.authenticated)
    {
        if(req.package)
        {
            res.render('./userpart/onepackage',{
                package:req.package,
                name:req.session.name,
                authenticated:req.session.authenticated,
                admin:req.session.admin
            })
        }else if(req.error)
        {
            res.render('./userpart/onepackage',{error:req.error,
                name:req.session.name,
                authenticated:req.session.authenticated,
                admin:req.session.admin
            })
        }else{
            res.render('./userpart/onepackage',{
            error:"Something goes wrong",
            name:req.session.name,
            authenticated:req.session.authenticated,
            admin:req.session.admin
        })
        }
    }else{
        res.redirect('/error')
    }

})


//booking one package
router.post('/booking/:pid',packageController.availableSeat,packageController.bookingPackage,(req,res)=>{
    if(req.session.authenticated)
    {
    if(req.done && req.email)
    {
        User.updateOne({email:req.email},{$push:{myorder:req.package}})
        .then(result=>{
            res.render('./userpart/confirmation',{
                package:req.package,
                name:req.session.name,
                authenticated:req.session.authenticated,
                admin:req.session.admin
            })
        }).catch(err=>{
            res.render('./userpart/confirmation',{error:err.message,name:req.session.name,
                authenticated:req.session.authenticated,
                admin:req.session.admin
            })
        })
    }else{
        if(req.error==="seat error")
        {
            res.render('./userpart/confirmation',{error:"Seats are not available",name:req.session.name,
            authenticated:req.session.authenticated,
            admin:req.session.admin
        })
        }else{
            res.render('./userpart/confirmation',{error:req.error,name:req.session.name,
                authenticated:req.session.authenticated,
                admin:req.session.admin
            })
        }
    }
}else{
    res.redirect('/error')
}
})



module.exports=router