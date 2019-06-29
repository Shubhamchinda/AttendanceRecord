const moment = require('moment')
// const tracer = request('tracer').console()
const addEmp = require('../controllers/addEmp')
import tracer from 'tracer'
import _ from 'lodash'
import async from 'async'
import request from 'request';
import { secret, errorObj, successObj } from '../../config/settings'
import Employe from '../models/employeInfo'
import attendanceInfo from '../models/attendanceInfo'


const exp = {

  list: ()=>{
    return new Promise(resolve=>{
      Employe.find({}, (error, data)=>{
      if(error){
        console.log("Error..", error)
        resolve({...errorObj, message: 'Error'})
      }
      // console.log("Data is", data);
      console.log("data length",data.length)
      resolve({...successObj, message: 'successful'})
      })
    })
  },
}
// exp.list()
module.export  = exp
