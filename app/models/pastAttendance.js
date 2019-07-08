import mongoose, {Schema} from 'mongoose'

class pastAttendance extends Schema {
  constructor () {

    const schema = super({
        empId:{type:Number, unique:true},
        empId:{type:String},
        Leaves:{type:String},
        Reason:{type:String},
        Status:{type:String},
        typeOfLeave:{type:String}
    });
      return schema
  }
}
export default mongoose.model('pastAttendance', new pastAttendance)
