function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

var appid = false;

function getCall (method, params) {
  var url = window.location.origin + '/winner/' + method + '?appid=' + appid;
  var bits = [];
  for (var key in params) {
    bits.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
  }
  if (bits.length > 0) {
    url += '&' + bits.join('&');
  }
  return url;
}

function getAppContact() {
  $.getJSON(getCall('getcontact'), function (data) {
    $('#inputemail').val(data.contact);
    $('#savedmsg').text('Saved');
  });
}

function getNextWin() {
  $.getJSON('/app/s/limited-time/nextwin.json', function (data) {
    $('#nextwinmsg').text(data.msg);
    var nextwin = Math.floor(Date.parse(data.on) / 1000);
    setInterval(function () {
      var nowtime = Math.floor((new Date()).getTime() / 1000);
      var dif = nextwin - nowtime;
      $('#numseconds').text(dif % 60);
      $('#numminutes').text(Math.floor(dif / 60) % 60);
      $('#numhours').text(Math.floor(dif / 3600) % 24);
      $('#numdays').text(Math.floor(dif / 86400));
    }, 1000);
  });
}

$(document).ready(function () {
  appid = getURLParameter('appid');

  getNextWin();
  getAppContact();

  $('#inputsend').click(function () {
    $('#savedmsg').text('Saving');
    var url = getCall('setcontact', {contact: $('#inputemail').val()});
    $.getJSON(url, function () {
      getAppContact();
    });
  });

  $('#inputemail').keypress(function () {
    $('#savedmsg').text('Unsaved');
  });
})
