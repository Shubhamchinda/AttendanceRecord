import mongoose, {Schema} from 'mongoose'
import { strict } from 'assert';

class employeeLeave extends Schema {
  constructor () {

    const empLeave = super({
        empId:{type:Number, unique:true},
        empId:{type:String},
        Leaves:{type:String},
        Reason:{type:String},
        Status:{type:String},
        paidLeave:{type:String},
        casualLeave:{type:String},
        sickLeave:{type:String}
    });
      return empLeave
  }
}
export default mongoose.model('employeLeave', new employeeLeave)
