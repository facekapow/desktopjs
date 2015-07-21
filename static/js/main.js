requirejs({
  paths: {
    jquery: '/support/jquery/dist/jquery.min.js',
    jqueryui: '/support/jqueryui/jquery-ui.min.js',
    datatables: '/support/datatables/media/js/jquery.dataTables.min'
  }
});

if (typeof jQuery == 'function') {
  define('jquery', function() {
    return jQuery;
  });
}

// guid() function from http://stackoverflow.com/a/105074/5119920
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

$(function() {
  var socket = io();
  $('body').on('contextmenu', '#desktop', function(e) { return false; });
  $('#desktop').css("left", 0);
  $('#desktop').css("top", 0);
  $('#desktop').width(screen.width-10);
  $('#desktop').height(screen.height-125);

  var apps = [];

  function appLaunched(name) {
    var ret = false;
    for (var i = 0; i < apps.length; i++) {
      if (ret == false) {
        if (apps[i].name == name) {
          return true;
        } else {
          ret = false;
        }
      }
    }
    return false;
  };

  function getAppIndex(name) {
    for (var i = 0; i < apps.length; i++) {
      if (apps[i].name == name) {
        return i;
      }
    }
  }

  socket.on('appbar content', function(content) {
    $('#appbar').html(content);
  });

  socket.emit('get apps');

  $(document).on('click', '.appshort a', function(e) {
    var appname = $(this).data('app');
    if (appLaunched(appname) == false) {
      socket.emit('launch app', appname);
      apps.push({
        name: appname,
        mod: {}
      });
      console.log('launching ' + appname + '...');
    } else {
      alert(appname + ' has already been launched.');
    }
  });

  socket.on('load content', function(path) {
    // generation
    var appwindow = document.createElement('div');
    var windowinner = document.createElement('div');
    var titlebar = document.createElement('div');
    var titlename = document.createElement('span');
    var close = document.createElement('a');
    // ids
    appwindow.id = path.name + '-window';
    windowinner.id = path.name + '-window-inner';
    titlebar.id = path.name + '-title-bar';
    titlename.id = path.name + '-title-name';
    close.id = path.name + '-title-close';
    // classes
    titlebar.className = 'titlebar';
    titlename.className = 'titlename';
    windowinner.className = 'inner-window';
    appwindow.className = 'app-window';
    close.className = 'titleclose';
    // attributes
    appwindow.setAttribute('data-app', path.name);
    // innerHTMLs
    titlename.innerHTML = path.name;
    close.innerHTML = 'X';
    // hrefs
    close.href = '#';
    // actions
    close.addEventListener('mousedown', function(e) {
      var appl = apps[getAppIndex(this.parentNode.parentNode.dataset.app)];
      appl.mod.cleanup();
      $('link[href="' + appl.csspath + '"]').remove();
      requirejs.undef(appl.jspath);
      $('script[src="' + appl.jspath + '"]').remove();
      apps.splice(getAppIndex(this.parentNode.parentNode.dataset.app), 1);
      socket.emit('app exited', this.parentNode.parentNode.dataset.app);
    });
    // jqueryui
    $(appwindow).draggable({
      containment: "parent",
      scroll: false
    });

    $(appwindow).draggable('disable');

    titlebar.addEventListener('mousedown', function(e) {
      $(appwindow).draggable('enable');
    });
    titlebar.addEventListener('mouseup', function(e) {
      $(appwindow).draggable('disable');
    });
    // append children
    titlebar.appendChild(titlename);
    titlebar.appendChild(close);
    appwindow.appendChild(titlebar);
    appwindow.appendChild(windowinner);
    desktop.appendChild(appwindow);
    // end generation

    apps[getAppIndex(path.name)].csspath = path.css;
    apps[getAppIndex(path.name)].jspath = path.js;
    requirejs([path.js], function(js) {
      apps[getAppIndex(path.name)].mod = js;
      apps[getAppIndex(path.name)].mod.desktop = document.getElementById(path.name + '-window-inner');
      apps[getAppIndex(path.name)].mod.socketsend = function(data) {
        socket.emit('data from ' + path.name, data);
      }
      apps[getAppIndex(path.name)].mod.main();
      socket.emit('content loaded');
    });
    var style = document.createElement('link');
    style.href = path.css;
    style.type = 'text/css';
    style.rel = 'stylesheet';
    document.head.appendChild(style);
  });

  socket.on('exit app', function(appname) {
    var appl = apps[getAppIndex(appname)];
    appl.mod.cleanup();
    $('link[href="' + appl.csspath + '"]').remove();
    requirejs.undef(appl.jspath);
    $('script[src="' + appl.jspath + '"]').remove();
    apps.splice(getAppIndex(appname), 1);
  });

  socket.on('app data', function(res) {
    apps[getAppIndex(res.name)].mod.socketHandler(res.data);
  });

  socket.on('app error', function(res) {
    apps[getAppIndex(res.name)].mod.errorHandler(res.data);
  });
});
