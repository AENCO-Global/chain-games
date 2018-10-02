/**
 * Component for interfacing with native Android or iOS application.
 * @class nativeBridge
 */
var nativeBridge  = (function () {

    var hookHolder; // Holds connection between native and webapp

    /**
     * @method _sendMessage
     */
    var _sendMessage = function(message, game){

	if(game.platform == "android") message = JSON.stringify(message);

	try{
	    // Unsure why but we must fully qualify reference here
	    nativeBridge.hookHolder.postMessage(message);
	}catch(err){
	    sockets.sendMessage(message);
	    console.log('Note: A hook has failed (probably because we are in-browser.)');
	}
    }

    /**
     * @method shareFacebookURL
     */
    var shareFacebookURL = function(game){
	var message = {"facebooksharelink": "http://google.com"};
	_sendMessage(message, game);
    }

    /**
     * @method shareFacebookImage
     */
    var shareFacebookImage = function(b64img, game){
	var message = {"facebookshare": b64img}
	_sendMessage(message, game);
    }

    /**
     * @method closeView
     */
    var closeView = function(game){
	var message;
	if(game.type == "start"){
	    message = {"closewebview": true}
	}else{
	    message = {"closewebviewwifmenu": true};
	}
	_sendMessage(message, game);
    };


    /**
     * @method clearDB
     */
    var clearDB = function(game){
	var message = {"removeRecord": true};
	_sendMessage(message, game);
    }    

    /**
     * @method sendMove
     */
    var sendMove = function(game) {

	switch(game.type){

	case 'end':
	    // Unbind touch events for swift people
	    $('#give-up-button').off();
	    $('#close-button').off();

	    game.state = "move";
	    game.data.winner = game.profile.me.uid;
	    game.notification = "You lost the game!";
	    game.start_notification = "";
	    break;
	    
	case 'quit':
	    game.state = "move";	
	    game.notification = "I gave up the game.";
	    game.start_notification = "";	
	    game.turn = game.profile.me.uid;		
	    game.winner = game.profile.yo.uid;
	    break;

	case 'cancel':
	    game.state = "move";		
	    game.notification = "I cancelled the game.";
	    game.start_notification = "";
	    game.turn = game.profile.me.uid;		
	    game.winner = game.profile.yo.uid;
	    break;

	case 'start':
	    game.type = "move";
	    game.state = "start";
	    game.notification = "I sent you a game move. Play!";
	    game.start_notification = "I started a game.";

	    setTimeout(function(){
		modals.showMoveSentModal();
		setTimeout(function(){
		    closeView(game);
		},1000);
	    },1000);
	    break;
	    
	case 'move':
	    game.type = "move";
	    game.state = "move";
	    game.notification = "I sent you a game move. Play!";
	    game.start_notification = "";

	    setTimeout(function(){
		modals.showMoveSentModal();
		setTimeout(function(){
		    closeView(game);
		},1000);
	    },1000);	    
	    break;
	}

	_sendMessage(game, game);
    };
    
    return{
	hookHolder : hookHolder,
	sendMove : sendMove,
	clearDB : clearDB,
	closeView : closeView,
	shareFacebookURL : shareFacebookURL,
	shareFacebookImage : shareFacebookImage
    }

})();

/* App entry point */
function onReceiveMessage(json){

    try{

	var game = JSON.parse(json);

	if(game.platform == "android"){
	    nativeBridge.hookHolder = android;	    
	}else{
	    nativeBridge.hookHolder = window.webkit.messageHandlers.native;
	}

	// Stop scrolling on device problem
	var meta = document.createElement('meta');
	meta.name = 'viewport';
	meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(meta);
	$(document).bind('touchmove', function(e) { e.preventDefault();});

	gameState.process(game);
    }catch(error){
	// alert(error);

	// Use socket server (debug) when run on localhost.
	(window.location.href.indexOf("localhost") > -1) ?
	    sockets.connect(json) : alert('Could not open game.');
    }
}

if(window.location.href.indexOf("localhost") > -1) onReceiveMessage(env.data);
