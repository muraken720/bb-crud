$(document).on("mobileinit", function () {
  "use strict";
  $.mobile.page.prototype.options.addBackBtn = true;
  $.mobile.linkBindingEnabled = false;
  $.mobile.hashListeningEnabled = false;
});
