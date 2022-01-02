const express = require('express');
const ParkingLot = require('../models/parkingLot');
const parkinglotuser = require('../parkinglotusers/parkinglotusers')
const router = express.Router();

router.use('/getallparkingslotbystatus',(req,resp,next)=>{
    let filter={}
    if(req.query.status){
        filter={status:req.query.status}
    }else{
        filter={}
    }
        console.log("in all parking slot");
        ParkingLot.find(filter).then(data=>{
        resp.status(200).json(
            {
                message:'success',
                count:data.length,
                data:data
            }
        )
    });

});

router.use('/getoccupiedparkingslot',(req,resp,next)=>{
    let filter={status :'occupied'}
    console.log("in all parking slot");
    ParkingLot.find(filter).then(data=>{
    resp.status(200).json(
        {
            message:'success',
            data:data
        }
    )
})

});
router.use('/getparkinglotusersbystatus',(req,resp,next)=>{
    let filter={}
    if(req.query.status){
        filter={parking_status:req.query.status}
    }else{
        filter={}
    }
console.log('status is',req.query.status);
    parkinglotuser.getRegisteredUser(filter).then(data=>{
       // console.log('data is',data);
    resp.status(200).json(
        {
            message:'success',
            count:data.length,
            parking_status:filter.parking_status?req.query.status:'all',
            data:data
        }

  );

});
});
module.exports= router