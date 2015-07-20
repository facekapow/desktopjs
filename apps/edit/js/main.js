define(function() {
  var read = false;
  var write = false;
  var readfile = false;
  var current_filename = '';
  var tmp = '';
  var bytes = '';
  var ret = {
    desktop: null,
    socketsend: null,
    cleanup: function() {
      document.getElementById('edit-window').parentNode.removeChild(document.getElementById('edit-window'));
    },
    main: function() {
      var outside = document.createElement('div');
      var container = document.createElement('div');
      var open = document.createElement('button');
      var save = document.createElement('button');
      var input = document.createElement('input');
      var textarea = document.createElement('textarea');
      var status = document.createElement('span');
      outside.id = 'edit-full-cont';
      container.id = 'edit-cont';
      open.id = 'edit-open';
      save.id = 'edit-save';
      input.id = 'edit-input';
      textarea.id = 'edit-text';
      status.id = 'edit-status';
      input.type = 'text';
      open.innerHTML = 'open';
      save.innerHTML = 'save';
      status.innerHTML = 'Ready!';
      open.onclick = function(e) {
        read = true;
        var val = document.getElementById('edit-input').value;
        ret.socketsend('getfile=' + val);
        document.getElementById('edit-status').innerHTML = 'Reading ' + val + '...';
        tmp = val;
      }
      save.onclick = function(e) {
        if (readfile === true) {
          write = true;
          var val = document.getElementById('edit-text').value;
          ret.socketsend('writefile=' + val);
          bytes = val.length + ((val.length === 1) ? ' byte' : ' bytes');
          document.getElementById('edit-status').innerHTML = 'Writing ' + bytes + ' to ' + current_filename + '...';
        }
      }
      container.appendChild(open);
      container.appendChild(save);
      container.appendChild(input);
      container.appendChild(document.createElement('br'));
      container.appendChild(textarea);
      container.appendChild(document.createElement('br'));
      container.appendChild(status);
      outside.appendChild(container);
      ret.desktop.appendChild(outside);
    },
    socketHandler: function(data) {
      if (read === true) {
        var textarea = document.getElementById('edit-text');
        textarea.value = String(data);
        read = false;
        readfile = true;
        current_filename = tmp;
        tmp = '';
        document.getElementById('edit-status').innerHTML = 'Read ' + String(data).length + ((String(data).length === 1) ? ' byte' : ' bytes') + ' from ' + current_filename + '.';
      } else if (write === true) {
        write = false;
        document.getElementById('edit-status').innerHTML = 'Wrote ' + bytes + ' to ' + current_filename + '.';
      }
    },
    errorHandler: function(err) {
      alert(err);
    }
  }
  return ret;
});