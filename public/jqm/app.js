$(function () {
  "use strict";

  var app = {};

  $("#memolist").on('tap', 'a', function () {
    app.selectedid = this.id;
    console.log("tap: " + app.selectedid);
  });

  $("#index").on('pagebeforeshow', function () {
    $.get('/memo', function (data) {
      $("#memolist").empty();
      for (var index = 0; index < data.length; index++) {
        $("#memolist").append('<li><a href="#view" id="' + data[index]._id +
          '"><h2>' + data[index].title + '</h2><p>' + data[index].content + '</p></a></li>');
      }
      $("#memolist").listview('refresh');
    });
  });

  $("#add").on('pagebeforeshow', function () {
    $("#add-title").val('');
    $("#add-content").val('');
  });

  $("#view").on('pagebeforeshow', function () {
    $.get('/memo/' + app.selectedid, function (data) {
      $("#view-title").html(data.title);
      $("#view-content").html(data.content);
    });
  });

  $("#edit").on('pagebeforeshow', function () {
    $.get('/memo/' + app.selectedid, function (data) {
      $("#edit-title").val(data.title);
      $("#edit-content").val(data.content);
    });
  });

  $("#save-addbtn").on('tap', function () {
    $.post('/memo', {
      title: $("#add-title").val(),
      content: $("#add-content").val()
    }, onSuccess, 'json');
  });

  $("#save-editbtn").on('tap', function () {
    $.ajax({
      type: 'PUT',
      url: '/memo/' + app.selectedid,
      data: {
        title: $("#edit-title").val(),
        content: $("#edit-content").val()
      },
      success: onSuccess,
      dataType: 'json'
    });
  });

  $("#del-btn").on('tap', function () {
    $.ajax({
      type: 'DELETE',
      url: '/memo/' + app.selectedid,
      success: onSuccess
    });
  });

  function onSuccess(data) {
    $("#message").html(data.message);
    $.mobile.changePage('#msg-dialog', {
      transition: 'slidedown',
      role: 'dialog'
    });
  }

}());
