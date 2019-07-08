import mongoose, { Schema } from 'mongoose'

class applyLeave extends Schema {
  constructor() {

    const leaves = super({
        EmpName:String,
        EmpId:Number,
        Status:{type:String,default:"under review"},
        LeaveType:String,
        DateTo:Date,
        DateFrom:Date,
        Reason:String
    });


    return leaves
  }
}

export default mongoose.model('applyleaves', new applyLeave) // eslint-disable-line
