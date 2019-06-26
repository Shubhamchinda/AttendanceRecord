import moongoose, {Schema} from 'mongoose'

class employeData extends Schema {
  constructor(){
    const schemas = super({
      id: {type: Number, unique: true},
      name: {type:String,required:true, trim:true},
      phone_no: {type: Number},
      timestamp:{type:Date,}
    });
    return schemas
  }
}
export default moongoose.model('Employee', new employeData)
