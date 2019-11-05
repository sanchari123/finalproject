const Package=require('../models/pakageinfo')
const User=require('../models/user')
exports.fetchAllPackages=(req,res,next)=>{
    try{
        Package.find().then(result=>{
            if(result.length)
            {
                req.packages=result
                next()
            }else{
                req.error="No data found"
                next()
            }
        }).catch(err=>{
            req.error=err.message
            next()
        })
    }catch(err)
    {
        req.error=err.message
        next()
    }
}

exports.fetchOnePackage=(req,res,next)=>{
    try{
        Package.findOne({_id:req.params.pid}).then(result=>{
            if(result)
            {
                req.package=result
                next()
            }else{
                req.error="Data not found"
                next()
            }
        }).catch(err=>{
            req.error=err.message
            next()
        })
    }catch(err)
    {
        req.error=err.message
        next()
    }
}
//booking of package
exports.bookingPackage=(req,res,next)=>{
    try{
        if(req.session.userid)
        {
            if(req.seaterror)
            {
                req.error="seat error"
                next()
            }else{
            User.findOne({_id:req.session.userid},{name:1,email:1,phonenumber:1,addressLine:1,myorder:1}).then(result=>{
                Package.update({_id:req.params.pid},{$push:{bookingDone:result},$set:{maximumseat:req.seats}}).then(resultp=>{
                    req.email=result.email
                    req.done=true
                    next()
                }).catch(err=>{
                    req.error=err.message
                    next()
                })
            }).catch(err=>{
                req.error=err.message
                next()
            })
        }
        }else{
            res.redirect('/user/userlogin')
        }
    }catch(err)
    {
        req.error=err.message
        next()
    }
}

exports.availableSeat=(req,res,next)=>{
    Package.findOne({_id:req.params.pid},{maximumseat:1,name:1,tid:1,imageurl:1}).then(result=>{
        console.log("hii"+result.maximumseat+req.body.seats)
        if(result.maximumseat>parseInt(req.body.seats))
        {
            req.package=result
            req.seats=result.maximumseat-req.body.seats
            next()
        }else{
            req.seaterror="Seats are not available"
            next()
        }
    }).catch(err=>{
        req.seaterror=err.message
        next()
    })
}