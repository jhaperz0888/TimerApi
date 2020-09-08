const express = require("express");
const router = express.Router();
const moment = require("moment");
const Joi = require("joi");

/* models */
const queryServices = require("../model/Query");

router.post("/logs", async (req, res) => {
  const { timestamp, log_type } = req.body;

  const schema = Joi.object({
    timestamp: Joi.date().required(),
    log_type: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).required(),
  });

  const object = {
    timestamp: timestamp,
    log_type: log_type,
  };

  const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
  const timeFormat = moment(timestamp, "YYYY-MM-DD HH:mm:ss", true).isValid();

  try {
    const validation = await schema.validateAsync(object);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.details[0].message,
    });
  }

  if (timeFormat) {
    try {
      const insertLogs =
        `INSERT INTO logs (timestamp, log_type, created_at) ` +
        `VALUES ('${timestamp}', '${log_type}', '${currentDate}')`;
      const result = await queryServices(insertLogs);

      return res.status(200).json({
        success: true,
        message: "created",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "timestamp wrong format (YYYY-MM-DD HH:mm:ss)",
    });
  }
});

router.get("/logs", async (req, res) => {
  try {
    const insertLogs = `SELECT id, timestamp, log_type FROM logs`;
    var result = await queryServices(insertLogs);

    // 2009-10-16T23:45:20.000Z
    // format datetime
    Object.keys(result).forEach(async (key) => {
      var time = result[key].timestamp
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      result[key].timestamp = time;
    });

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.delete("/logs/:id", async (req, res) => {
  const { id } = req.params;

  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });

  const object = {
    id: id,
  };

  // const validation = await validationServices(object, schema, res);
  try {
    const validation = await schema.validateAsync(object);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const deleteLog = `UPDATE logs SET status=0 WHERE id=${id}`;
    var result = await queryServices(deleteLog);

    return res.status(200).json({
      success: true,
      message: "deleted",
    });
  } catch (error) {}
});

module.exports = router;
