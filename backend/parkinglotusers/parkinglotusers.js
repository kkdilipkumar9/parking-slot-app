const ParkingLotUsers = require('../models/parkinglotusers');

async function getRegisteredUser(filter =null){
  data=  await ParkingLotUsers.find(filter)
    return data;
} 
async function getValidUserForParkingSlot(filter){
    fltr={...filter,parking_status:''
    }
    console.log('filter for valid user*******',fltr);
    data=  await ParkingLotUsers.find(fltr)
      return data;
  } 

  function updateParkingStatusForUser(parkingData){
      console.log('filter for update user ',parkingData)
      updateData={
          parking_status:parkingData.status,
          parking_location:parkingData.parking_location,
          parking_id:parkingData.parking_id
      }
      ParkingLotUsers.findOneAndUpdate(parkingData.user_id,updateData,{returnOriginal: false}).then(data=>{
          console.log('user updated',data)
      });
  }

module.exports= {getRegisteredUser,getValidUserForParkingSlot,updateParkingStatusForUser}
