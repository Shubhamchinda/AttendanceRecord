import moongoose, {Schema} from 'mongoose'

class attendanceData extends Schema {
  constructor(){
    const schemas = super({
      // name:{type:String, unique:true},
      id: {type: Number, unique:true},
      inTime: {type:Date},
      // type: {type: String},
      timeStamp:{type:Date},
      outTime: {type:Date},
      machineid:{type:Number},

      });
    return schemas
  }
}
export default moongoose.model('attendanceInfo', new attendanceData)
