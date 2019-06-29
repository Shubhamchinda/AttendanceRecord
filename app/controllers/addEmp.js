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

 addEmp :  (emp_id, emp_name, emp_phone_no, emp_salary, emp_address, emp_gender) => {
  return new Promise((resolve) => {
      // const {emp_id, emp_name, emp_phone_no} = data
      const employee = new Employe({
        id:emp_id,
        name:emp_name,
        phone_no:emp_phone_no,
        timestamp:new Date(),
        salary: emp_salary,
        address:emp_address,
        gender: emp_gender
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
  }
}
// exp.addEmp(1,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
// exp.addEmp(2,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
// exp.addEmp(3,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
// exp.addEmp(6,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
// exp.addEmp(7,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
// exp.addEmp(8,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
// exp.addEmp(9,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
// exp.addEmp(10,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
// exp.addEmp(11,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
// exp.addEmp(12,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
// exp.addEmp(13,'qwer', 12345, 1234, 'c4f janakpoijk', 'male')
module.exports = exp;
