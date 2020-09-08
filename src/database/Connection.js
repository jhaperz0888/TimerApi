const mysql = require("mysql");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "morales",
  port: 3306,
  database: "timer",
  multipleStatements: true,
  timezone: "+08:00",
};

const DB = mysql.createConnection(dbConfig);

DB.connect(function (err) {
  if (!err) {
    console.log("Database is connected ...");
  } else {
    console.log("Error connecting database ...");
    process.exit(1);
  }
});

DB.on("error", function (err) {
  console.log(err.code);
});

function query(queryStatement) {
  return new Promise((resolve, reject) => {
    DB.query(queryStatement, (error, results, fields) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(results);
      }
    });
  });
}

module.exports.query = query;
module.exports.DB = DB;
