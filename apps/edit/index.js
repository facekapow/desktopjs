var exports = module.exports = {
  socketsend: null,
  scoketsenderr: null,
  exitapp: null
};

exports.main = function() {
  var fs = require('fs');
  var currently_open = '';
  exports.socketHandler = function(data) {
    if (data.substr(0, 8) === 'getfile=') {
      try {
        var cont = fs.readFileSync(__dirname + '/../../../../Documents/' + data.substr(8));
        currently_open = data.substr(8);
        exports.socketsend(String(cont));
      } catch(e) {
        exports.socketsenderr(e);
      }
    } else if (data.substr(0, 10) === 'writefile=') {
      try {
        fs.writeFileSync(__dirname + '/../../../../Documents/' + currently_open, data.substr(10));
        exports.socketsend('done');
      } catch(e) {
        exports.socketsenderr(e);
      }
    }
  };
};