var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fork = require('child_process').fork;
var fs = require('fs');

app.use(express.static('static'));
app.use('/support', express.static('bower_components'));

var apps = [];

function getAppIndex(name) {
  for (var i = 0; i < apps.length; i++) {
    if (apps[i].name == name) {
      return i;
    }
  }
}

io.sockets.setMaxListeners(0);

io.on('connection', function(socket) {
  socket.on('get apps', function() {
    var total_cont = '';
    try {
      fs.statSync('apps');
      fs.statSync('apps/apps.json');
      var json = JSON.parse(fs.readFileSync('apps/apps.json'));
      for (var i in json.apps) {
        app.use('/apps/' + i + '/asset/png', express.static('apps/' + i + '/asset/png'));
        var appbar_cont = fs.readFileSync('apps/' + i + '/appbar.html');
        total_cont += appbar_cont + '\n';
      }
      socket.emit('appbar content', total_cont);
    } catch(e) {
      console.log('make sure you have a folder called \'apps\'.');
      console.log('if you do, make sure there's a file called \'apps.json\'.');
      console.log('if you have that, too, check it\'s contents to make sure it doesn\'t have extra apps you didn\'t install.');
      throw new Error('could not load applications!');
    }
  });

  socket.on('launch app', function(appl) {
    app.use('/apps/' + appl + '/js', express.static('apps/' + appl + '/js'));
    app.use('/apps/' + appl + '/css', express.static('apps/' + appl + '/css'));
    fs.stat('apps/' + appl + '/bower_components', function(err, stat) {
      if (err == null) {
        app.use('/apps/' + appl + '/support', express.static('apps/' + appl + '/bower_components'));
      }
    });

    var paths = {
      name: appl,
      js: '/apps/' + appl + '/js/main.js',
      css: '/apps/' + appl + '/css/main.css'
    };

    socket.emit('load content', paths);

    socket.on('content loaded', function() {
      var jsproc = require(__dirname + '/apps/' + appl + '/index.js');
      jsproc.socketsend = function(data) {
        socket.emit('app data', {
          name: appl,
          data: data
        });
      }

      jsproc.socketsenderr = function(err) {
        socket.emit('app error', {
          name: appl,
          error: err
        });
      }

      jsproc.onget = function(callback) {
        app.get('/' + appl, function(req, res) {
          callback(req, res);
        });
      }

      //jsproc.exposeFile = function()

      var appobj = {
        name: appl,
        proc: jsproc
      };

      appobj.proc.main();

      appobj.proc.exitapp = function() {
        socket.emit('exit app', appl);
        // un-require it
        delete require.cache[__dirname + '/apps/' + appl + '/index.js'];
        // remove the route:
        var routes = app._router.stack;
        routes.forEach(function(route, i, routes) {
          if (!route.path) return;
          var path = route.path.substr(6);
          var appname = path.substr(0, path.indexOf('/'));
          switch (appname) {
            case appl:
              routes.splice(i, 1);
              break;
            default:
              break;
          }
        });
      }

      socket.on('data from ' + appl, function(dt) {
        jsproc.socketHandler(dt);
      });

      socket.on('app exited', function(appl) {
        // un-require it
        delete require.cache[__dirname + '/apps/' + appl + '/index.js'];
        // remove the route:
        var routes = app._router.stack;
        routes.forEach(function(route, i, routes) {
          if (!route.path) return;
          var path = route.path.substr(6);
          var appname = path.substr(0, path.indexOf('/'));
          switch (appname) {
            case appl:
              routes.splice(i, 1);
              break;
            default:
              break;
          }
        });
      });

      apps.push(appobj);
    });
  });
});

http.listen(80, function() {
  console.log('desktop being served on port 80.');
  console.log('waiting for users to flood on in.');
});
