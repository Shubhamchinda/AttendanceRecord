import mongoose, { Schema } from 'mongoose'

class employeeLeave extends Schema {
  constructor() {

    const modelvalues = super({
     EmpName:String,
     EmpId:Number,
     NoOfLeaves:Number,
     PL:Number,
     CL:Number,
     SL:Number
    });


    return modelvalues
  }
}

export default mongoose.model('employeeAttendance', new employeeLeave) // eslint-disable-line
