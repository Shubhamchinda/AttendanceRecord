const moment = require('moment')
// const tracer = request('tracer').console()
const addEmp = require('../controllers/addEmp')
import tracer from 'tracer'
import _ from 'lodash'
import async from 'async'
const console=require('tracer').console()
import request from 'request';
import { secret, errorObj, successObj } from '../../config/settings'
import attendanceInfo from '../models/attendanceInfo'
import Machineconfig from '../../config/machineconfig.json'
import add from '../controllers/addEmp'
import { on } from 'cluster';
import Employe from '../models/employeInfo';


const jsonAttendance = ['2,29-06-2019,10:27:00,IN','2,29-06-2019,12:45:00,OUT','3,29-06-2019,09:30:00,IN','4,29-06-2019,09:30:00,IN','5,29-06-2019,09:19:00,IN','6,29-06-2019,09:30:00,IN','7,29-06-2019,09:19:00,IN','9,29-06-2019,09:29:00,IN','10,29-06-2019,09:29:00,IN','11,29-06-2019,09:31:00,IN','12,29-06-2019,09:29:00,IN','13,29-06-2019,09:26:00,IN'];
let finalMessage = ``;
const exp = {
  stringToRecords:(string)=>{
    let str = string.replace('"', '')
    var str1 = str.split('\\r\\n')
    str1.pop()
    // console.log(str1)
    return str1
  },
  attendance: ()=>{
    console.log("run")
    return new Promise(resolve=>{
        request('https://login.myofficeguardian.com/login/v_1_1/api_attendance/auth/2911/520bae6649b42ff5a3c8c58b7fcfc5a9', (error, response, body)=>{
          if (error) {
             console.log("error....", error)
          }

            let records = exp.stringToRecords(body);
              // machineid= Machineconfig[0].machineId
              // let records = jsonAttendance;
              async.each(records, async(value, next) => {
              let x = value.split(",");
              let record = {id : x[0], date:x[1], time:x[2], type:x[3]}
              let dateNtime = moment(record.date, "DD-MM-YYYY")
              let splitTime = (record.time).split(':')
              dateNtime.add("hours", splitTime[0])
              dateNtime.add("minute", splitTime[1])
              dateNtime.add("second", splitTime[2])
              let  Exist = await attendanceInfo.exists({ id: record.id });
                if (Exist) {
                  if(record.type == 'OUT' ) {
                      let  up = await attendanceInfo.update({id: record.id}, {outTime: dateNtime},
                      (err, writeresult)=>{
                        console.log(err)
                        })
                    }else{}
                }
                else
                      {
                  const attendance = new attendanceInfo({
                    id:record.id,
                    inTime:dateNtime,
                    timeStamp:new Date(),
                    outTime:null,
                    machineid:Machineconfig[0].machineId
                  })
                  attendance.save((error, record)=>{
                    if(error){
                      console.log("Saving Error is..", error);
                    }
                    else{
                      console.log("Record Saved\nRecord is..", record);
                    }
                  })
                }
                next()
              })
           return resolve({...successObj, message: 'success'})
        })
        resolve({...errorObj, message: 'Error'})
    })
  },
  getMorningShiftReport : async (machinedata)=>{
        const {machineId}  = machinedata
        let {openingTime} = machinedata
        const {error, data} = await exp.getTodaysAttendance(machineId)

         if(error){
          console.log('error getting the data please check', error)
          return false
        }
        let x = openingTime.split(':')
        openingTime = moment()
            .startOf('day')
            .add(x[0],'hour')
            .add(x[1],'minute')
            .add(x[2],'second')
            let onTime = [];
            let notOnTime = []
            let message = ``
          async.each(data, (item, done)=>{
                  const isLate = moment(item.inTime)
                                  .isAfter(openingTime)


              if(isLate){
                  const minutes = moment(item.inTime)
                                  .diff(moment(openingTime), 'minute')
                                  item.minutes = minutes
                                  notOnTime.push(item);
                        }
              else{
                onTime.push(item)
              }
              done()
            },async ()=>{

              let {length} = await exp.length()
              let presentEmp = `${data.length} out of ${length} are present`
              console.log(presentEmp)
              message = `${onTime.length} of them are on time`
              console.log(message)
              async.each(notOnTime, async (item)=>{
                let {names} = await exp.lateEmployee(item.id)
                message = ` ${names} was ${item.minutes} minutes late\n`
                finalMessage = finalMessage+ message
                console.log(finalMessage)
              })
            })
          },
  length: ()=>{
            return new Promise(resolve=>{
              Employe.find({}, (error, data)=>{
              if(error){
                console.log("Error..", error)
                resolve({...errorObj, message: 'Error'})
              }
              console.log("data length",data.length)
              resolve({...successObj, message: 'successful',length:data.length})
              })
            })
          },
  lateEmployee : (late)=>{
              return new Promise((resolve)=>{
                  let user = Employe.findOne({id:late})
                  user.exec((error, data)=>{
                  resolve({names:data.name})
                })
              })
          },
  getTodaysAttendance : (machineid)=>{
            return new Promise(resolve=>{
            const today = new Date()
    //        console.log(machineid);
            const startDate = moment(today)
                              .startOf('day')
                              .toDate()
  //          console.log("start date", startDate)

            const endDate = moment(today)
                            .endOf('day')
                            .toDate()

      //    console.log("end date", endDate)

          let query = attendanceInfo.find()
          query.where({machineid})

          // query.where({inTime:{$lte: endDate, $gt: startDate}})
          query.lean()

          query.exec((err, data)=>{
            if(err){
              return resolve({...errorObj, })
            }
            // console.log(data)
            resolve({...successObj, data})
          })
      })
  }
}
exp.attendance();
// exp.getTodaysAttendance('1')
exp.getMorningShiftReport(Machineconfig[0]);
module.exports = exp

