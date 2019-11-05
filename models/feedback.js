const mongoose=require('mongoose')

const Feedback=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true },
    fullname: {type: String, required: true},
    phonenumber:{type:Number},
    message:{type:String}
})

module.exports=mongoose.model('feedbacks',Feedback)