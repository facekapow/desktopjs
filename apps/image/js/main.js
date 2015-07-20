define(function() {
  var ret = {
    desktop: null,
    socketsend: null,
    cleanup: function() {
      document.getElementById('image-window').parentNode.removeChild(document.getElementById('image-window'));
    },
    main: function() {
      var outside = document.createElement('div');
      var container = document.createElement('div');
      var imgc = document.createElement('img');
      var loading = document.createElement('p');
      var loadimg = document.createElement('input');
      loadimg.id = 'image-load-img';
      loadimg.type = 'text';
      loadimg.addEventListener('keyup', function(e) {
        if (e.keyCode == 13 || e.which == 13) {
          ret.socketsend(this.value);
          this.style.display = 'none';
          document.getElementById('image-loading').style.display = 'block';
        }
      });
      imgc.id = 'image-imgc';
      loading.innerHTML = 'loading image...';
      loading.style.display = 'none';
      imgc.style.display = 'none';
      loading.id = 'image-loading';
      container.id = 'image-cont';
      outside.id = 'image-full-cont';
      container.appendChild(imgc);
      container.appendChild(loadimg);
      container.appendChild(loading);
      outside.appendChild(container);
      ret.desktop.appendChild(outside);
    },
    socketHandler: function(data) {
      document.getElementById('image-imgc').style.display = 'none';
      document.getElementById('image-loading').style.display = 'block';
      document.getElementById('image-imgc').style.display = 'none';
      document.getElementById('image-imgc').onload = function() {
        document.getElementById('image-loading').style.display = 'none';
        document.getElementById('image-imgc').style.display = 'block';
      };
      document.getElementById('image-imgc').src = 'data:image/png;base64,' + data;
    },
    errorHandler: function(err) {
      alert('Error. ' + err);
    }
  }
  return ret;
});
