import express from "express";
import request from "request";
import Async from "async";
import EmpController from "./../models/newEmployee";
import { secret, errorObj, successObj } from "../../config/settings";
import newEmployee from "../models/newEmployee";
const console = require("tracer").colorConsole();

const app = express.Router();

const empCtrl = {
  msgg: "hello",
  addEmp: data => {
    return new Promise(resolve => {
      let newUser = new EmpController({
        employeeId: data.employeeId,
        name: data.name,
        contactnumber: data.contact
      });
      newUser.save(function(err) {
        if (err) {
          console.log(err);
        }
      });
    });
  },
  listEmp: () => {
    newEmployee.find({}).exec(function(err, users) {
      if (err) throw err;
      console.log(users);
    });
  }
};
// empCtrl.addEmp({
//   employeeId: 4,
//   name: "shubham",
//   contact: 1232067891
// });
// empCtrl.listEmp();

export default app;
