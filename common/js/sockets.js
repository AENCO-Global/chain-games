/**
 * Component for interfacing with native Android or iOS application.
 * @class 
 */

var sockets = (function(){

    var server;

    var connect = function(game) {
	console.log('==Debug Mode Enabled==')
	
    	server = io.connect(env["socket"], {query:'roomId='+env.room+'&userId='+Math.floor((Math.random() *100)+1)});
	
    	server.on("server", function(data) {  
    	    if (data.type == 'connect' ) { 
    		// console.log(game);
		gameState.process(game);
    	    } else if (data.type != "disconnect") {
		$(".column").off("click");
		$("#close-button").off("click");
		$("#give-up-button").off("click");
		gameState.process(data);
    	    }
    	});
    }

    var sendMessage = function(game){

	// just to stop game message/action confusion
	if(game.profile == null){
	    console.log('discarding action hook call');
	    return
	};

    	// Simulate switching user
    	game.turn = game.profile.yo.uid;

    	var yo = game.profile.yo;
    	var me = game.profile.me;
	
    	game.profile.me = yo;
    	game.profile.yo = me;

    	server.emit("client", game);
	
    	// Swap back
    	var yo = game.profile.yo;
    	var me = game.profile.me;
	
    	game.profile.me = yo;
    	game.profile.yo = me;

    }

    var sendSync = function(obj) {    
    	server.emit("client", obj);
    }

    return{
	connect : connect,
	sendMessage : sendMessage
    }

}());
