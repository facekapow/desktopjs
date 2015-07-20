define(function() {
  var ret = {
    desktop: null,
    socketsend: null,
    cleanup: function() {
      document.getElementById('term-window').parentNode.removeChild(document.getElementById('term-window'));
    },
    main: function() {
      var outside = document.createElement('div');
      var container = document.createElement('div');
      var icont = document.createElement('div');
      icont.id = 'term-input-cont';
      outside.id = 'term-full-cont';
      container.id = 'term-cont';
      var elm3 = document.createElement('span');
      elm3.innerHTML = '@bash>';
      elm3.id = 'term-output-3';
      icont.appendChild(elm3);
      var inputelm = document.createElement('input');
      inputelm.id = 'term-input';
      inputelm.type = 'text';
      inputelm.addEventListener('keyup', function(e) {
        this.style.width = ((this.value.length + 1) * 9) + 'px';
        if (e.keyCode == 13 || e.which == 13) {
          if (document.getElementById('term-input').value != 'clear') {
            ret.socketsend(document.getElementById('term-input').value);
            var content = document.createElement('p');
            content.className = 'term-output';
            content.innerHTML = '@bash>' + document.getElementById('term-input').value + "\n";
            container.insertBefore(content, icont);
            document.getElementById('term-input').value = '';
          } else {
            var elms = document.getElementsByClassName('term-output');
            while (elms[0]) {
              elms[0].parentNode.removeChild(elms[0]);
            }
            document.getElementById('term-input').value = '';
          }
        }
      });
      icont.appendChild(inputelm);
      container.appendChild(icont);
      outside.appendChild(container);
      ret.desktop.appendChild(outside);
      inputelm.focus();
    },
    socketHandler: function(data) {
      var cont = document.getElementById('term-cont');
      var icont = document.createElement('div');
      var elm = document.createElement('p');
      elm.className = 'term-output';
      elm.innerHTML = '> ' + data.replace(/\n\Z/, "");
      var newinput = document.createElement('input');
      newinput.id = 'term-input';
      newinput.type = 'text';
      newinput.addEventListener('keyup', function(e) {
        this.style.width = ((this.value.length + 1) * 9) + 'px';
        if (e.keyCode == 13 || e.which == 13) {
          if (document.getElementById('term-input').value != 'clear') {
            ret.socketsend(document.getElementById('term-input').value);
            var content = document.createElement('p');
            content.className = 'term-output';
            content.innerHTML = '@bash>' + document.getElementById('term-input').value + "\n";
            cont.insertBefore(content, icont);
            document.getElementById('term-input').value = '';
          } else {
            var elms = document.getElementsByClassName('term-output');
            while (elms[0]) {
              elms[0].parentNode.removeChild(elms[0]);
            }
            document.getElementById('term-input').value = '';
          }
        }
      });
      var elm3 = document.createElement('span');
      icont.id = 'term-input-cont';
      elm3.innerHTML = '@bash>';
      elm3.id = 'term-output-3';
      document.getElementById('term-input-cont').parentNode.removeChild(document.getElementById('term-input-cont'));
      cont.appendChild(elm);
      icont.appendChild(elm3);
      icont.appendChild(newinput);
      cont.appendChild(icont);
      newinput.focus();
      cont.scrollTop = cont.scrollHeight;
    },
    errorHandler: function(err) {
      
    }
  }
  return ret;
});
