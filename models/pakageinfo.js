const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pakage = new Schema({
    name: {type: String},
    tid:{type:String, required:true},
    amount: { type: Number },
    places: { type: Array },
    startdate: { type: Date },
    enddate: { type: Date },
    imageurl: { type: Array },
    hotel: { type: String },
    tourmanager: {
        name: {type: String},
        phno: {type: String, min: 10, max:12},
        mailid: {type: String}
    },
    reviews:{type:Array,default:[]},
    visitor:{type:Number,default:0},
    maximumseat:{type:Number,required:true},
    bookingDone:{type:Array,default:[]}
});

module.exports = mongoose.model('pakage', Pakage);