const mongoose = require("mongoose");
const uniqueValidator= require('mongoose-unique-validator')
const parkinglotUserSchema = mongoose.Schema({
    user_id:{type:String},
    username:{type:String},
    parking_id:{type:String, required:true,unique:true},
    parking_location:{type:String},
    parking_status:{type:String}},
    {collection:'parking_lot_users'})
    parkinglotUserSchema.plugin(uniqueValidator);
    module.exports = mongoose.model("ParkingLotUsers",parkinglotUserSchema);