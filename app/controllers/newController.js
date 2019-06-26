// import validator from 'email-validator'
// import jwt from 'jsonwebtoken'
// import { TableFilterQuery } from 'sz-node-utils'
const moment = require('moment')
// const tracer = request('tracer').console()
import tracer from 'tracer'
import _ from 'lodash'
import async from 'async'
import Employe from '../models/employeInfo'
import attendanceInfo from '../models/attendanceInfo'


import { secret, errorObj, successObj } from '../../config/settings'
// import { request } from 'https';
import request from 'request';

const jsonAttendance = ['2,25-06-2019,09:27:00,IN','2,25-06-2019,12:45:00,OUT','3,25-06-2019,09:30:00,IN','4,25-06-2019,09:30:00,IN','5,25-06-2019,09:19:00,IN','6,25-06-2019,09:30:00,IN','7,25-06-2019,09:19:00,IN','9,25-06-2019,09:25:00,IN','10,25-06-2019,09:25:00,IN','11,25-06-2019,09:31:00,IN','12,25-06-2019,09:25:00,IN','13,25-06-2019,09:26:00,IN'];
function stringToRecords(string){
    let str = string.replace('"', '')
    var str1 = str.split('\\r\\n')
    str1.pop()
    // console.log(str1)
    return str1
}

const exp = {
  add: (emp_id, emp_name, emp_phone_no) => {
    return new Promise((resolve) => {

      // const {emp_id, emp_name, emp_phone_no} = data

      const employee = new Employe({
          id:emp_id,
          name:emp_name,
          phone_no:emp_phone_no,
          timestamp:new Date()
      })
      employee.save((error, record)=>{
            if(error){
              console.log("Error is..", error);
              resolve({...errorObj, message: 'Error'})
            }
          else{
            console.log("Record is..", record);
            resolve({...successObj, message: 'successful',})
          }
      })
    })
  },
  list: ()=>{
    return new Promise(resolve=>{
      Employe.find({}, (error, data)=>{
      if(error){
        console.log("Error..", error)
        resolve({...errorObj, message: 'Error'})
      }
      console.log("Data is", data);
      resolve({...successObj, message: 'successful',})
      })
    })
  },
  attendance: ()=>{
    return new Promise(resolve=>{
      // console.log("qwerg")
        request('https://login.myofficeguardian.com/login/v_1_1/api_attendance/auth/2911/520bae6649b42ff5a3c8c58b7fcfc5a9', (error, response, body)=>{
          if (error) {
             console.log("error....", error)
          }
            // console.log("Body", body);
            // let records = stringToRecords(body);
            // console.log(typeof body)
            let records = jsonAttendance;
            async.each(records, async(value, next) => {
              let x = value.split(",");
              let record = {id : x[0], date:x[1], time:x[2], type:x[3]}



              // console.log(record + record.id)
              let dateNtime = moment(record.date, "DD-MM-YYYY")
              let splitTime = (record.time).split(':')
              dateNtime.add("hours", splitTime[0])
              dateNtime.add("minute", splitTime[1])
              dateNtime.add("second", splitTime[2])
                // if(record.type == 'IN'){
                  // console.log(record.id)
                let  Exist = await attendanceInfo.exists({ id: record.id });
                if (Exist) {
                  if(record.type == 'OUT' ) {


                    let  up = await attendanceInfo.update({id: record.id}, {outtime: dateNtime},
                      (err, writeresult)=>{
                        console.log(err)
                        }
                      )
                    }
                }
                else {
                  console.log(record.id)
                  const attendance = new attendanceInfo({
                    id:record.id,
                    dateNTime:dateNtime,
                    // type:record.type,
                    timestamp:new Date(),
                    outtime:null
                  })
                  attendance.save((error, record)=>{
                    if(error){
                      console.log("Saving Error is..", error);
                    }
                    else{
                      // console.log("Record Saved\nRecord is..", record);
                    }
                  })
                }
                next()
              // }




              // const attendance = new attendanceInfo({
              //   id:record.id,
              //   dateNTime:dateNtime,
              //   type:record.type,
              //   timestamp:new Date()
              // })
              // attendance.save((error, record)=>{
              // if(error){
              //   console.log("Error is..", error);
              // }
              // else{
              //   console.log("Record is..", record);
              // }
              // })
           })
           return resolve({...successObj, message: 'success'})

        })
        resolve({...errorObj, message: 'Error'})
    })
  },
}


// exp.add(2,'mohit',123456);
// export default exp

// exp.list();
exp.attendance()


// profile
// login
// usersList
// update
// delete
// removeAll
