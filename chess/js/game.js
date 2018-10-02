/**
 * Chess game for 1-1 chat rooms in Chaatz.
 * Users can start a game from Android/iOS clients from within
 * a chatroom, make a move and transmit it to their chat partner
 * via XMPP.
 * Uses chess.js (https://github.com/jhlywa/chess.js/blob/master/README.md) for game logic.
 * and chessboard.js (http://chessboardjs.com) for UI.
 * @class chess
 * @requires functions
 * @main chess
 */
var chess = (function () {

    /**
     * Starts the game!
     * @method initialize
     * @constructor
     */
    var initialize = function(){

	// To prevent Drag on the screen. if you ned drag to refresh the conent, then add to the touchmove funtion
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(meta);
        $(document).bind('touchmove', function(e) { e.preventDefault();/*Add drag screen shit in here. */  });

    };

    return {initialize};
}());
chess.initialize();
