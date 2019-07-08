import express from "express";
import request from "request";
import _ from "lodash";
import mongoose from "mongoose";
import ordinal from "ordinal";
import pluralize from "pluralize";
import capitalize from "capitalize";
import Async from "async";
import AttendanceController from "../models/attendances";
import EmpCtrl from "../models/newEmployee";
import { secret, errorObj, successObj } from "../../config/settings";
import { setDateTime } from "./_utils";
import MachineConfig from "./../../config/machineConfig.json";
import newEmployee from "../models/newEmployee";
const console = require("tracer").colorConsole();
var moment = require("moment");
var schedule = require("node-schedule");

const app = express.Router();

const emp = {
  msgg: "hello",
  add: (user, machineId) => {
    return new Promise(resolve => {
      let dateNtime = setDateTime(user.date, user.time);
      console.log("add");
      AttendanceController.findOne(
        { employeeId: user.employeeId },
        async function(err, result) {
          if (result) {
            console.log("user already exists");
            if (user.type == "OUT") {
              console.log("OUt");
              result.outTime = dateNtime;
              return result.save(function(err) {
                if (err) {
                  console.log(err);
                }
              });
            }
          } else if (user.type == "IN") {
            console.log("New User");
            let newUser = new AttendanceController({
              employeeId: user.employeeId,
              inTime: dateNtime,
              date: new Date(),
              machineId: machineId
            });
            newUser.save(function(err) {
              if (err) {
                console.log(err);
              }
            });
          }
        }
      );
    });
  },
  getRequest: ({ url, machineId = 1 }) => {
    return new Promise(resolve => {
      request(url, async (error, response, body) => {
        if (error) {
          resolve({ ...errorObject });
        }
        let recordBody = await emp.bodyToJson(body);
        Async.each(recordBody, async value => {
          console.log("yess");
          let addUser = await emp.add(value, machineId);
        });
        resolve({ recordBody, ...successObj });
      });
    });
  },
  getAttendance: machineId => {
    return new Promise(resolve => {
      console.log("IN getAttendance");

      let today = new Date();
      const startDate = moment(today)
        .startOf("day")
        .toDate();
      const endDate = moment(today)
        .endOf("day")
        .toDate();

      let query = AttendanceController.find();
      query.where({ machineId });
      // query.where({ inTime: { $lte: endDate } });

      query.exec((err, docs) => {
        if (err) {
          return resolve({ ...errorObj });
        }

        resolve({ ...successObj, docs });
      });
    });
  },
  getReport: async machine => {
    const { machineId } = machine;
    const { error, docs } = await emp.getAttendance(machineId);
    let { openingTime } = machine;

    let temp = openingTime.split(":");

    openingTime = moment()
      .startOf("day")
      .add(temp[0], "hour")
      .add(temp[1], "minute")
      .add(temp[2], "second");
    console.log(openingTime);

    let late = [];
    let onTime = [];
    let msg = ``;

    Async.each(
      docs,
      (value, done) => {
        let isLate = moment(value.inTime).isAfter(openingTime);
        console.log(isLate, value.inTime);
        if (isLate) {
          console.log(value.employeeId);
          const minutes = moment(value.inTime).diff(
            moment(openingTime),
            "minute"
          );
          value.minutes = minutes;

          late.push(value);
        } else {
          onTime.push(value);
        }
        done();
      },
      () => {
        msg = `${docs.length} are present out of ${
          newEmployee.length
        } of ${ordinal(machineId)} machine.\n`;
        msg += `${onTime.length} out of ${docs.length} are on time.\n`;
        Async.each(
          late,
          async (item, done) => {
            let { name } = await emp.getEmpName(item.employeeId);
            msg += `${capitalize(name)} was ${item.minutes} ${pluralize(
              "minute"
            )} late.\n`;
            done();
          },
          () => {
            console.log(msg);
          }
        );
      }
    );
  },
  bodyToJson: data => {
    data = data.replace('"', "");
    data = data.replace('"', "");
    data = data.split("\\r\\n");
    data = data.map(item => {
      let newItem = item.split(",");
      return {
        employeeId: newItem[0],
        date: newItem[1],
        time: newItem[2],
        type: newItem[3]
      };
    });
    return _.filter(data, x => !!x.employeeId);
  },
  getEmpName: id => {
    return new Promise(resolve => {
      let query = EmpCtrl.findOne({ employeeId: id });

      query.exec((err, data) => {
        if (err) {
          return resolve({ ...errorObj, err, message: "User not added yet" });
        }
        resolve({ ...successObj, name: data.name });
      });
    });
  }
};

// schedule.scheduleJob("*/20 * * * * *", function() {
//   Async.each(MachineConfig, machine => {
//     console.log(machine.url, machine.machineId);
//     emp.getRequest({
//       url: machine.url,
//       machineId: machine.machineId
//     });
//   });
// });

//   console.log("hello");
// });

// schedule.scheduleJob("30 15 * * *", function() {
//   console.log(MachineConfig[0].url);
//   emp.getReport(MachineConfig[0]);
// });
// emp.getReport(MachineConfig[0]);

export default app;
