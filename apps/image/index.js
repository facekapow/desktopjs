var exports = module.exports = {
  socketsend: null,
  socketsenderr: null,
  exitapp: null
};

exports.main = function() {
  var fs = require('fs');

  exports.socketHandler = function(data) {
    try {
      fs.readFile(__dirname + '/../../../../Pictures/' + data, function(err, dt) {
        if (err) {
          exports.socketsenderr(err);
        } else {
          var base64 = new Buffer(dt).toString('base64');
          exports.socketsend(base64);
        }
      });
    } catch(e) {
      exports.socketsenderr(e);
    }
  }
}
