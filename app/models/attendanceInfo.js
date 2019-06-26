import moongoose, {Schema} from 'mongoose'

class attendanceData extends Schema {
  constructor(){
    const schemas = super({
      id: {type: Number, unique:true},
      dateNTime: {type:Date},
      // type: {type: String},
      timestamp:{type:Date},
      outtime: {type:Date}
      });
    return schemas
  }
}
export default moongoose.model('attendanceInfo', new attendanceData)
