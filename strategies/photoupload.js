const multer=require('multer')

exports.strategy=multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,`uploads`)
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})