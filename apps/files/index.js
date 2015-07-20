var exports = module.exports = {
  socketsend: null,
  socketsenderr: null,
  onGet: null,
  exitapp: null
}

exports.main = function() {
  var _ = require('lodash');
  var fs = require('fs');
  var path = require('path');
  var util = require('util');

  exports.socketHandler = function(data) {
    var dir =  __dirname + '/../../../../';

    var currentDir = dir;
    var query = data || '';
    if (query) currentDir = path.join(dir, query);
    try {
      var files = fs.readdirSync(currentDir);
      var data = [];
      files
      .filter(function(file) {
         return true;
      }).forEach(function(file) {
       try {
         if (file[0] != '.') {
           var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
           if (isDirectory) {
             data.push({ Name : file, IsDirectory: true, Path : path.join(query, file)  });
           } else {
             var ext = path.extname(file);
              data.push({ Name : file, Ext : ext, IsDirectory: false, Path : path.join(query, file) });
           }
         }
       } catch(e) {
         console.log(e);
       }
      });
      data = _.sortBy(data, function(f) { return f.Name });
      exports.socketsend(data);
    } catch(e) {
      throw e;
    }
  }
}
