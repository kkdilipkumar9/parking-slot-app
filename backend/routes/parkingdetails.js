const express = require('express');
const ParkingLot = require('../models/parkingLot');
const parkinglotuser = require('../parkinglotusers/parkinglotusers')
const router = express.Router();

router.use('/getallparkingslot',(req,resp,next)=>{
        console.log("in all parking slot");
        ParkingLot.find({}).then(data=>{
        resp.status(200).json(
            {
                message:'request success',
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
            message:'request success',
            data:data
        }
    )
})

});
router.use('/getparkinglotusers',(req,resp,next)=>{
    let filter={status :'occupied'}
    parkinglotuser.getRegisteredUser().then(data=>{
        console.log('data is',data);
    resp.status(200).json(
        {
            message:'request success',
            data:data
        }

  );

});
});
module.exports= router