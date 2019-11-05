const mongoose=require('mongoose')

const UserSchema=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    password:{ type: String, required: true},
    fullname: {type: String, required: true},
    recvisit: [],
    mostvisit:[],
    carts:[],
    addressLine:{type:String},
    phonenumber:{type:Number},
    gender:{type:String},
    country:{type:String},
    myorder:{type:Array,default:[]}
})

module.exports=mongoose.model('Users',UserSchema)