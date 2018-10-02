/**
 * Component for interfacing with native Android or iOS application.
 * @class 
 */

var sockets = (function(){

    var server;

    var connect = function(user_id,room_id) {

	console.log('==Debug Mode Enabled==')
    	console.log("Connecting to Server",user_id,room_id);
	
    	server = io.connect(env["socket"], {query:'roomId='+env.room+'&userId='+Math.floor((Math.random() *100)+1)});
	
    	server.on("server", function(data) {  
    	    if (data.type == 'connect' ) { 
    		// console.log(data);
		// if (env.connected == false) { 
		//     console.log(data);
		//     gameState.process(data);
		//     //Set a blank object like nothing happens.
		//     env.connected = true; 
		// }
    	    } else if (data.type != "disconnect") {
		$(".column").off("click");
		$("#close-button").off("click");
		$("#give-up-button").off("click");
		gameState.process(data);
    	    }
    	});
    }

    var sendMessage = function(game){

	console.log('socket send message');
	console.log(game);

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
