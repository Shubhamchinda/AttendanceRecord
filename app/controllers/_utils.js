import moment from "moment";

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/");
};

export const setDateTime = (date, time) => {
  let dateNtime = moment(date, "DD-MM-YYYY");
  console.log(time);
  let splitTime = time.split(":");
  let hrs = dateNtime.add("hours", splitTime[0]);
  let mins = dateNtime.add("minute", splitTime[1]);
  let sec = dateNtime.add("second", splitTime[2]);

  return dateNtime;
};

export default {};
