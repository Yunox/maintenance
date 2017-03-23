requirejs.config({
  "baseUrl": "assets/javascript",
  "paths": {
    "jquery": "lib/j",
  }
});
// Load the main app module to start the app
requirejs(["jquery"], function ($) {
  $(function() {
    console.log( ">> jQuery loaded!" );
});
})
