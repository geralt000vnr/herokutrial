const Express = require("express");
const holidayRouter = Express.Router();
const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  userId: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  reason: { type: String, required: true },
  alternateEmail: { type: String, required: true },
  alternateMobile: { type: Number, required: true },
  status: { type: String, default: "Decision Pending" },
  type: {
    type: String,
    required: true,
    default: "casualLeave",
  },
});

const Holiday = mongoose.model("Holidays", holidaySchema);

holidayRouter.get("/getHolidayList", async (req, res) => {
  const result = await Holiday.find();
  console.log("consolee", result);
  res.status(200).send(result);
  res.end();
});

holidayRouter.get("/getHolidayDetails/:id", async (req, res) => {
  const result = await Holiday.find({ _id: req.params.id });
  res.status(200).send(...result);
  res.end();
});

holidayRouter.post("/applyNewHoliday", async (req, res) => {
  const list = await Holiday.find();
  console.log("consoled add holiday", req.body);
  const result = await addHoliday({ ...req.body, id: list.length + 1 });

  res.send(result);
  res.end();
});

holidayRouter.put("/updateHoliday", async (req, res) => {
  const result = await updateHoliday(req.body);
  res.send("Data Updated");
  res.end();
});

holidayRouter.delete("/deleteHoliday/:id", async (req, res) => {
  const result = deleteRecord(req.params.id);
  res.status(200).send(result);
  res.end();
});

const addHoliday = async (values) => {
  try {
    const holiday = new Holiday({
      userId: values.userId,
      startDate: values.startDate,
      endDate: values.endDate,
      reason: values.reason,
      alternateEmail: values.alternateEmail,
      alternateMobile: values.alternateMobile,
      id: values.id,
    });
    const result = await holiday.save();
    return result;
  } catch (error) {
    console.log("error in applying Holiday :", error);
    return { error: error };
  }
};

const deleteRecord = async (id) => {
  const result = await Holiday.deleteOne({ _id: id });
  return result;
};

const updateHoliday = async (values) => {
  const result = await Holiday.updateOne(
    { _id: values.id },
    {
      $set: {
        userId: values.userId,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason,
        alternateEmail: values.alternateEmail,
        alternateMobile: values.alternateMobile,
        dateUpdate: Date.now,
      },
    },
  );
  return result;
};

module.exports = holidayRouter;
