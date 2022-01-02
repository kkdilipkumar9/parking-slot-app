const mongoose = require("mongoose");
const uniqueValidator= require('mongoose-unique-validator')
const parkinglotSchema = mongoose.Schema({
    parking_id:{type:String, required:true,unique:true},
    user_id:{type:String},
    request_time:{type:String},
    allocation_time:{type:String},
    allocation_endtime:{type:String},
    parking_location:{type:String},
    status:{type:String},
    category:{type:String}},{collection:'parking_lot'})
parkinglotSchema.plugin(uniqueValidator);
    module.exports = mongoose.model("ParkingLot",parkinglotSchema);