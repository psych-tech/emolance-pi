var express = require('express');
var sys = require('sys');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var cors = require('cors')
var needle = require('needle');
var fs = require('fs');


var app = express();
app.use(cors());

app.get('/process/:userId', function (req, res) {
  var time = new Date().getTime();
  var fileName = req.params.userId + "-" + time;
  execSync("/usr/bin/camera " + fileName);
  var imageReport = {};
  imageReport.timestamp = time;
  imageReport.url = 'http://s3.amazonaws.com/emolance-photos/' + fileName + '.jpg';
  res.send(imageReport);
});

app.get('/process/self/trigger', function (req, res) {
  var time = new Date().getTime();
  var fileName = sn + "-" + time;
  execSync("/usr/bin/camera " + fileName);
  var imageReport = {};
  imageReport.timestamp = time;
  imageReport.url = 'http://s3.amazonaws.com/emolance-photos/' + fileName + '.jpg';
  res.send(imageReport);
});

app.get('/ping', function(req, res) {
  res.send('OK');
});


function getSerialNumber() {
    var res = execSync('get-serial.sh');
    console.log("Getting Serial Number: " + res.toString());
    var arr = res.toString().split(":");
    return arr[1].trim(); 
}

function registerDevice(sn) {
    var options = {
  headers: { 'X-Custom-Header': 'Emolance' }
}

    needle
        .post('http://admin:admin@hlab.yusun.io/api/devices/register/' + sn, '', options, function(error, response) {
            if (!error && response.statusCode == 200) {
                console.log("Device registered successfully!");
            } else {
                console.log("Failed: " + error);
            }
        });
}

function writeYmlConfigWithSn(sn) {
  var stream = fs.createWriteStream("/home/pi/.ngrok2/ngrok.yml");
  stream.once('open', function(fd) {
      stream.write("authtoken: 7wBPwmzwU2esuUHvtJA2R_4kQwpiswRcJyD3axcZSmB\n");
      stream.write("tunnels:\n");
      stream.write("  emolance:\n");
      stream.write("    subdomain: \"" + sn + ".emolance\"\n");
      stream.write("    addr: 3000\n");
      stream.write("    proto: http\n");
      stream.write("  ssh:\n");
      stream.write("    proto: tcp\n");
      stream.write("    addr: 22\n");
      stream.end();
  });
}

var sn = "N/A";

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;
  
  sn = getSerialNumber();
  writeYmlConfigWithSn(sn);

  registerDevice(sn);

  exec('/home/pi/ngrok start --all', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });

  console.log('Emolance app listening at http://%s:%s', host, port);
  console.log('Public endpoint is http://' + sn + '.emolance.ngrok.io');
});
