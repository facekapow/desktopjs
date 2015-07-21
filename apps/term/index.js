var exports = module.exports = {
  socketsend: null,
  scoketsenderr: null,
  exitapp: null
};

exports.main = function() {
  var fs = require('fs');
  var shell = require('child_process').spawn('bash', [], {
    stdio: 'pipe'
  });

  shell.stdin.setEncoding('utf8');

  exports.socketHandler = function(data) {
    if (data == 'exit') {
      shell.stdin.end();
    } else {
      shell.stdin.write(data + "\n");
    }
  }

  shell.stdout.on('data', function(data) {
    exports.socketsend(String(data).replace(/\n\Z/, ""));
  });

  shell.stderr.on('data', function(data) {
    exports.socketsenderr(String(data).replace(/\n\Z/, ""));
  });

  shell.on('exit', function(code) {
    exports.socketsend('exiting with code ' + code + '.');
    exports.exitapp();
  });
}
