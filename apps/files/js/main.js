define(['jquery', "/apps/files/support/bootstrap/dist/js/bootstrap.min.js", 'datatables'], function() {
  var ret = {
    desktop: null,
    socketsend: null,
    cleanup: function() {
      document.getElementById('files-window').parentNode.removeChild(document.getElementById('files-window'));
      $('link[href="/apps/files/support/bootstrap/dist/css/bootstrap.min.css"]').remove();
      $('link[href="/apps/files/support/font-awesome/css/font-awesome.min.css"]').remove();
    },
    main: function() {
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
    },
    errorHandler: function(err) {

    }
  }
  return ret;
});
