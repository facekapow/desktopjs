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
/*
function FileManager(type) {
  this.type = type || 'file';
  this.id = guid();

  var path = {
    name: 'file-manager',
    js: '/apps/file-manager/js/main.js',
    css: '/apps/file-manager/css/main.css'
  };

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
      apps[getAppIndex(path.name)].mod.fileManager = {};
      apps[getAppIndex(path.name)].mod.fileManager = FileManager;
      apps[getAppIndex(path.name)].mod.main();
      socket.emit('content loaded');
    });
    var style = document.createElement('link');
    style.href = path.css;
    style.type = 'text/css';
    style.rel = 'stylesheet';
    document.head.appendChild(style);

  // style injection
      // bootstrap
      var bootstrapstyle = document.createElement('link');
      bootstrapstyle.type = 'text/css';
      bootstrapstyle.rel = 'stylesheet';
      bootstrapstyle.href = '/apps/files/support/bootstrap/dist/css/bootstrap.min.css';
      document.head.appendChild(bootstrapstyle);
      // font-awesome
      var fontawesomestyle = document.createElement('link');
      fontawesomestyle.type = 'text/css';
      fontawesomestyle.rel = 'stylesheet';
      fontawesomestyle.href = '/apps/files/support/font-awesome/css/font-awesome.min.css';
      document.head.appendChild(fontawesomestyle);
      // end style injection
      var outside = document.createElement('div');
      var container = document.createElement('div');
      var filescont = document.createElement('div');
      var header = document.createElement('div');
      var spanup = document.createElement('span');
      var iup = document.createElement('i');
      header.className = 'files-panel-heading';
      filescont.className = 'files-panel files-panel-default files-mainpanel';
      filescont.id = 'files-file-cont';
      header.innerHTML = 'File Browser';
      spanup.className = 'files-up';
      iup.className = 'fa fa-level-up';
      spanup.appendChild(iup);
      spanup.innerHTML = spanup.innerHTML + ' Up';
      header.appendChild(spanup);
      var pbod = document.createElement('div');
      pbod.className = 'files-panel-body';
      var ptable = document.createElement('table');
      ptable.className = 'files-linksholder';
      container.id = 'files-cont';
      outside.id = 'files-full-cont';
      pbod.appendChild(ptable);
      filescont.appendChild(header);
      filescont.appendChild(pbod);
      container.appendChild(filescont);
      outside.appendChild(container);
      ret.desktop.appendChild(outside);

      var extensionsMap = {
        ".zip": "fa-file-archive-o",
        ".gz": "fa-file-archive-o",
        ".bz2": "fa-file-archive-o",
        ".xz": "fa-file-archive-o",
        ".rar": "fa-file-archive-o",
        ".tar": "fa-file-archive-o",
        ".tgz": "fa-file-archive-o",
        ".tbz2": "fa-file-archive-o",
        ".z": "fa-file-archive-o",
        ".7z": "fa-file-archive-o",
        ".mp3": "fa-file-audio-o",
        ".cs": "fa-file-code-o",
        ".c++": "fa-file-code-o",
        ".cpp": "fa-file-code-o",
        ".js": "fa-file-code-o",
        ".xls": "fa-file-excel-o",
        ".xlsx": "fa-file-excel-o",
        ".png": "fa-file-image-o",
        ".jpg": "fa-file-image-o",
        ".jpeg": "fa-file-image-o",
        ".gif": "fa-file-image-o",
        "mpeg": "fa-file-movie-o",
        ".pdf": "fa-file-pdf-o",
        ".ppt": "fa-file-powerpoint-o",
        ".pptx": "fa-file-powerpoint-o",
        ".txt": "fa-file-text-o",
        ".log": "fa-file-text-o",
        ".doc": "fa-file-word-o",
        ".docx": "fa-file-word-o"
      };

      function getFileIcon(ext) {
        return (ext && extensionsMap[ext.toLowerCase()]) || 'fa-file-o';
      }

      var currentPath = null;
      var options = {
        "bProcessing": true,
        "bServerSide": false,
        "bPaginate": false,
        "bAutoWidth": false,
        "sScrollY":"250px",
        "fnCreatedRow" :  function(nRow, aData, iDataIndex) {
          if (!aData.IsDirectory) return;
          var path = aData.Path;
          $(nRow).bind("click", function(e) {
            ret.socketsend(path);
            currentPath = path;
            e.preventDefault();
          });
        },
        "aoColumns": [
          { "sTitle": "", "mData": null, "bSortable": false, "sClass": "head0", "sWidth": "55px",
            "render": function (data, type, row, meta) {
             if (data.IsDirectory) {
               return "<a href='#' target='_blank'><i class='fa fa-folder'></i>&nbsp;" + data.Name +"</a>";
             } else {
               if (Object.prototype.toString.call(data) != '[object Array]') return "<a href='/" + data.Path + "' target='_blank'><i class='fa " + getFileIcon(data.Ext) + "'></i>&nbsp;" + data.Name +"</a>";
               if (Object.prototype.toString.call(data) == '[object Array]') return "<span>Empty! Go up.</span>"
               return '';
             }
           }
          }
        ]
      };

      var table = $(".files-linksholder").dataTable(options);

      ret.socketHandler = function(data) {
        table.fnClearTable();
        table.fnAddData(data);
      }

      $(".files-up").bind("click", function(e) {
        if (!currentPath) return;
        var idx = currentPath.lastIndexOf("/");
        var path = currentPath.substr(0, idx);
        ret.socketsend(path);
        currentPath = path;
      });
      setTimeout(function() {
        ret.socketsend('');
      }, 100);

  this.open = function(cb) {

  };
}
*/
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
      //apps[getAppIndex(path.name)].mod.fileManager = FileManager;
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
