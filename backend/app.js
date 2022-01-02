const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const parkingLotRoutes = require('./routes/bookparkingLot')
const parkingdetailsRoutes = require('./routes/parkingdetails');

//`mongodb+srv://dkumar:password123456@cluster0.ioox8.mongodb.net/parkingLot?retryWrites=true&w=majority`

const MONGO_CONNECTION = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ioox8.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());

app.use((req, resp, next) => {
    resp.setHeader("Access-Control-Allow-Origin", "*");
    resp.setHeader("Access-Control-Allow-Headers", "Authorization","*");
    resp.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    next();
})

mongoose.connect(MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB connected**");
    }).catch((err) => {
        console.log("DB connection error occured", err);
    });


app.use('/parkinglot', parkingLotRoutes);
app.use('/parkingdetails', parkingdetailsRoutes)


module.exports = app;