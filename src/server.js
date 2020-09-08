const express = require("express");
const app = express();
const bodyParser = require("body-parser");

/* middleware */
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const timer = require("./routes/Timer");

// API routes
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api", timer);

const port = 3002;

app.listen(port, () => {
  console.log(`listening to port ${port}...`);
});
