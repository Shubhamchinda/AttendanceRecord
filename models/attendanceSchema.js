import mongoose, { Schema } from 'mongoose'

class getAttendance extends Schema {
  constructor() {

    const modelvalues = super({
      EmpId: { type: Number },
      date:{type:Date},
      timestamp:{type:String},
      type:{type:String},
      inTime:{type:Date},
      outTime:{type:Date},
      machId:{type:Number}
    });


    return modelvalues
  }
}

export default mongoose.model('employeeAttendance', new getAttendance) // eslint-disable-line
