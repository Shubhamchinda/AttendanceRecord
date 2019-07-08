import mongoose, { Schema } from 'mongoose'

class addEmployee extends Schema {
  constructor() {

    const mongoosemodel = super({
      EmpName: { type: String },
      EmpId:{type:Number},
      email: { type: String, unique: true, lowercase: true, trim: true },
      phoneno: {type:Number},
      address:{type:String},
      salary:{type:Number},
      gender:{type:String},
      joiningDate:{type:Date}
    });


    return mongoosemodel
  }
}

export default mongoose.model('employee', new addEmployee) // eslint-disable-line
