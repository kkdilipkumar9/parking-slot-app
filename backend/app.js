const express = require('express');
const cors = require('cors');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const app = express();
const ParkingLot = require('./models/parkingLot');
const parkingLotRoutes= require('./routes/bookparkingLot')
const parkingdetailsRoutes= require('./routes/parkingdetails');

//`mongodb+srv://dkumar:password123456@cluster0.ioox8.mongodb.net/parkingLot?retryWrites=true&w=majority`

const MONGO_CONNECTION= `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ioox8.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.json());

app.use((req,resp,next)=>{
    resp.setHeader("Access-Control-Allow-Origin","*");
    resp.setHeader("Access-Control-Allow-Headers","Authorization",
    "*");
    resp.setHeader("Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS");
    next();
})

mongoose.connect(MONGO_CONNECTION,{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>{
    console.log("DB connected**");
}).catch((err)=>{
    console.log("DB connection error occured",err);
});


app.use('/parkinglot',parkingLotRoutes);
app.use('/parkingdetails',parkingdetailsRoutes)

/*app.post('/parkingLot/requestparkingLot',(req,resp,next)=>{
    let requestData = req.body;
    currentTime= new Date();
    arrivalTime = new Date(requestData.arrivalTime);
   timeDifference =Math.round( (arrivalTime.getTime() - currentTime.getTime())/60000);
    console.log('request data is ' +arrivalTime,timeDifference);
    if(timeDifference>=15){
    if(requestData.category && requestData.user_id){
        bookParkingLot(requestData)
    }
   // bookingStatus=
    resp.status(200).json(
        {
            message:'parking slot booked'
        }
    )
}else{
    resp.status(200).json(
        {
            message:'parking slot can be booked 15 minutes in advance'
        }
    )
}
})
function bookParkingLot(reqData){
        if(reqData){
        checkForVacantParkingLot(reqData);
        }
    }

    function checkForVacantParkingLot(reqData){
       let  filter={};
       let updateData={
           request_time: new Date(),
           allocation_time: new Date(),
            allocation_endtime:addMinutes(new Date(),30),
            status:'booked',
            user_id: reqData.user_id
       }
        filter.category= reqData.category;
        filter.status="";
      //  filter.parking_location="A1";

         ParkingLot.findOneAndUpdate(filter,updateData,{returnOriginal: false}).then(data=>{
             if(data){
            const parkingLot=data;
            console.log('Updated new data is',parkingLot);
            parkingLotOccupiedPrms = new Promise((resolve,reject)=>{
                setInterval(()=>{
                    resolve(parkingLot);
                },10000);
            });
             }else{
                 console.log('Checking in general category')
             }
             parkingLotOccupiedPrms.then((data)=>{
                 console.log('parking to be cancelled',data);
                ParkingLot.findById(data._id).then(data=>{
                    if(data.status !='occupied'){
                        ParkingLot.findByIdAndUpdate(data._id,{status:"",user_id:""}).then(updated=>{
                            console.log('cancelling the parking ticket booking',updated);

                        });
                       
                    }
                })
            });
             
        });
        
    }

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
    }
    */


module.exports = app;