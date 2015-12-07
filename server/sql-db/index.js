var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database:"digitaldining"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db: ', err);
    return;
  }
  console.log('Connection established');
});

module.exports = {
  con:con
};
