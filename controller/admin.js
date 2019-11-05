const Package=require('../models/pakageinfo')
const Users=require('../models/user')
exports.adminController=(req,res,next)=>{
    try{
        let name=req.body.name
        let amount=parseInt(req.body.amount)
        let places=req.body.places.split(',')
        let startdate=req.body.startdate
        let enddate=req.body.enddate
        let maximumseat=parseInt(req.body.maximumseat)
        let now=new Date()
        let tid=name.slice(0,3)+amount.toString()+now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear()+"/"+now.getHours()+"/"+now.getMinutes()
        var imageurl=[]
        for(let i=0;i<req.files.length;i++)
        {
            imageurl.push('uploads/'+req.files[i].originalname)
        }
        let hotel=req.body.hotel
        let tourmanager={
            name:req.body.tname,
            phno:req.body.tphno,
            mailid:req.body.tmail
        }
        const package=new Package({
            tid,
            name,
            amount,
            places,
            startdate,
            enddate,
            imageurl,
            hotel,
            tourmanager,
            maximumseat
        })
        package.save().then(result=>{
            if(result)
            {
                res.redirect('/admin/packageupload')
            }
            else{
                res.redirect('/admin/packageupload/?error=something goes wrong')
            }
        }).catch(err=>{
            res.redirect(`/admin/packageupload/?error=${err.message}`)
        })
    }catch(err)
    {
        res.redirect(`/admin/packageupload/?error=${err.message}`)
    }
}

exports.fetchAllUsers=(req,res,next)=>{
    Users.find({email:{$ne:process.env.admin}}).then(result=>{
        req.users=result
        next()
    }).catch(err=>{
        req.error=err.message
        next()
    })
}

exports.fetchAllPackages=(req,res,next)=>{
    Package.find().then(result=>{
        if(result.length)
        {
            req.package=result
            req.error=null
            next()
        }else{
            req.error="No data found"
        }
    }).catch(err=>{
        req.error=err.message
        next()
    })
}
