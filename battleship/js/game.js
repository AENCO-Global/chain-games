/**
 * battleship class, write a description
 * @class battleship
 * @requires functions
 * @main battleship
 */
var battleship  = (function () {

    var initialize = function() {
    	// Handle the view port drag prevention
	    var meta = document.createElement('meta');
	        meta.name = 'viewport';
	        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
	        var head = document.getElementsByTagName('head')[0];
	        head.appendChild(meta);
	        $(document).bind('touchmove', function(e) {	e.preventDefault(); });
	// Real case!
	// recieveMove();
	
	// For our testing only
	hook.init();
    }

    return{initialize: initialize};    
}());
battleship.initialize();
