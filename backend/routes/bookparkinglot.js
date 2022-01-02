const express = require('express');
const ParkingLot = require('../models/parkingLot');
const router = express.Router();
const parkinglotuser = require('../parkinglotusers/parkinglotusers');
const { getRegisteredUser, updateParkingStatusForUser } = require('../parkinglotusers/parkinglotusers');
const PARKING_WAITING_PERIOD=1000 * 60 * 1;
router.post('/bookparkinglot', (req, resp, next) => {
    console.log('In routes');
    let requestData = req.body;
    currentTime = new Date();
    arrivalTime = new Date(requestData.arrivalTime);
    timeDifference = Math.round((arrivalTime.getTime() - currentTime.getTime()) / 60000);
    console.log('request data is ' + arrivalTime, timeDifference);
    if (timeDifference >= 15) {
        parkinglotuser.getValidUserForParkingSlot({ user_id: requestData.user_id }).then(user => {
            console.log('user found', user);
            if (user.length > 0) {
                checkForVacantParkingLot(requestData, resp)
            }
            else {
                resp.status(200).json(
                    {
                        message: 'User not  allowed for parking slot'
                    }
                )
            }
        })
        if (requestData.category && requestData.user_id) {
            //   checkForVacantParkingLot(requestData,resp)
        }
    } else {
        resp.status(200).json(
            {
                message: 'parking slot can be booked 15 minutes in advance'
            }
        )
    }
})

function checkForVacantParkingLot(reqData, resp) {
    console.log('in checked parking slot', reqData);
    let filter = {};
    let updateData = {
        request_time: new Date(),
        allocation_time: new Date(),
        allocation_endtime: addMinutes(new Date(), 30),
        status: 'booked',
        user_id: reqData.user_id
    }
    filter.category = reqData.category;
    filter.status = "";
    //////////////////////////////////
    ParkingLot.findOne(filter).then(result => {
        console.log(result);
        if (result) {
            bookParkingLot(filter, updateData, resp);
        } else if (!result && reqData.category == 'reserved') {
            filter.category = "general"
            console.log('No reserved', result);
            bookParkingLot(filter, updateData, resp);
        }
    });
}
/////////////////////////////////
function bookParkingLot(filter, updateData, resp) {
    console.log('filter data is', filter);
    let parkingLot
    ParkingLot.findOneAndUpdate(filter, updateData, { returnOriginal: false }).then(data => {
        console.log("update parking data is", data);
        if (data) {
             parkingLot = data;
            parkinglotuser.updateParkingStatusForUser(data);
            console.log('Updated new data is', parkingLot);
            resp.status(200).json(
                {
                    message: 'Parking booked',
                    parkingDetails: parkingLot
                }
            )

        } else {
            console.log('Parking lot full');
            resp.status(200).json(
                {
                    message: 'No vacant parking available',

                }
            )
            return;
        }
        parkingLotOccupiedPrms = new Promise((resolve, reject) => {
            console.log('in promise',parkingLot);
            setInterval(() => {
                resolve(parkingLot);
            },PARKING_WAITING_PERIOD);
        });
        parkingLotOccupiedPrms.then((data) => {
            console.log('parking to be cancelled', data);
            ParkingLot.findById(data._id).then(data => {
                let userdata = {
                    user_id: data.user_id,
                    status: '',
                    parking_location: '',
                    parking_id: ''
                }
                if (data.status != 'occupied') {
                    ParkingLot.findByIdAndUpdate(data._id, { status: "", user_id: "" }).then(updated => {
                        console.log('cancelling the parking ticket booking', updated);
                        updateParkingStatusForUser(userdata);
                    });

                }
            })
        });

    }).catch(err => {
        console.log(err);
        resp.status(400).json(
            {
                message: 'Error',
                data: err
            }
        )

    });

}

router.post('/occupyparkinglot', (req, resp, next) => {
    let filter={}
    filter.parking_id =  req.body.parking_id;
    filter.status= "booked"
    console.log('in occupy parking');
            ParkingLot.findOneAndUpdate(filter,{status:"occupied"}, { returnOriginal: false }).then(updatedData => {
                if(updatedData){
                    let userdata = { ...updatedData,
                        status: 'occupied'
                    }
                    updateParkingStatusForUser(userdata);
                resp.status(200).json(
                    {
                        message: 'Parking slot occupied',
                        data: updatedData
                    }
                );
            }else{
                resp.status(404).json(
                    {
                        message: 'Parking slot not found',
                        data: updatedData
                    }
                );
            }
            });
});
router.post('/resetparkinglot',(req,resp,next)=>{
    let filter=  req.body;
    console.log(filter)
   let updateData= {
    user_id:'',
    request_time:'',
    allocation_time:'',
    allocation_endtime:'',
    status:''
   }
    ParkingLot.updateMany({},updateData).then(respData=>{
        parkinglotuser.resetAllParkingUserStatus()
        resp.status(200).json(
            {
                message:'parking slot data reset successfully',
                data:respData
            }
        )
    })
})

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

module.exports = router;