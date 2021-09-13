var express = require("express");
var app = express();

var cors = require('cors');
app.use(cors())

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));


// Database
var mysql = require('mysql');
var file  = require('./components/_functions_db.js');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: 'mag'
});
con.connect(function(err) {
  if (err) throw err;
});


/* ---------------------------------------
+++++++++++++++++ API ++++++++++++++++++++
------------------------------------------ */


// ---------- GET --------------
app.get("/get-file-list",  (req, res, next) => {
  file.getFiles(con,res)
});

app.get("/get-result/:id",  (req, res, next) => {
  file.getResult(con,res,req.params.id)
});

app.get("/get-last-result",  (req, res, next) => {
  file.getLastResult(con,res)
});

app.get("/get-user",  (req, res, next) => {
  file.getUser(con,res)
});




/// ----- POST --------- 
app.post("/parse-tcx", (req, res, next) => {
    var result      = {};
    const fs = require('fs');
    fs.writeFile('./node.tcx', req.body.data, err => {
      if (err) {
        res.json({result: err, success: false})
      } else {
        const spawn = require("child_process").spawn;
        const pythonProcess = spawn('python',["./data_extraction.py"]);
        pythonProcess.stdout.on('data', (data) => {
            try {
              result['data']  = JSON.parse(data.toString().replace(/'/g, '"').trim());
              file.saveFile(con,res,result['data'],req.body.file_name);
            } catch (error) {
              res.json({result: error, success: false})
            }
        });
      }
    })
});


app.listen(3000, () => {
 console.log("Server running on port 3000");
});
