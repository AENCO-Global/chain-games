/**
 * Component for interfacing with native Android or iOS application.
 * @class hook
 */

var hookHolder;

// Hook call back in global scope.
function onReceiveMessage(json){

    var parsedData = JSON.parse(json);    
    env.data = parsedData;

    if(env.data.platform == "android"){
	hookHolder =  android;
    }else{
	try{
	    hookHolder = window.webkit.messageHandlers.native;
	}catch(e){
	    $("body").html("Game unavailable. Please try again later");
	}
    }

    // Initialize case    
    if(env.data.type == "start"){

	// "start" because that's what chessboard.js expects
	env.data.data.game_board = "start";
	env.data.data.move_count = 0;
	env.data.turn = env.data.profile.me.uid;
	env.data.profile.me.color = "white";
	env.data.profile.yo.color = "black";
    }

    if(env.data.profile.me.img == ""){
	env.data.profile.me.img = "img/user.jpg"
    }

    if(env.data.profile.yo.img == ""){
	env.data.profile.yo.img = "img/user.jpg"
    }

    env.data.notification = "";
    env.data.start_notification = "";
    
    scenes.show();
}

var hook  = (function () {

    var sendMessage = function(message){
	if(hookHolder){	
	    if(env.data.platform == "android"){
		hookHolder.postMessage(JSON.stringify(message));
	    }else{
		hookHolder.postMessage(message);
	    }
	}
    }

    var shareFacebookURL = function(){

	var message = {"facebooksharelink": "http://google.com"}

	try{
	    sendMessage(message);
	}catch(err){
	    console.log(err)
	}
    }
    
    var shareFacebookImage = function(b64img){

	var message = {"facebookshare": b64img}

	try{
	    sendMessage(message);
	}catch(err){
	    
	}
    }

    // to be a call back function to close the view
    var closeView = function(from){

	var message;

	if(env.data.type == "start"){
	    message = {"closewebview": true}
	}else{
	    message = {"closewebviewwifmenu": true};
	}

	sendMessage(message);
    };

    var clearDB = function(){
	var message = {"removeRecord": true};
	sendMessage(message);
    }
        //Send the move somewhere. 
    var sendMove = function() {

	if(hookHolder){	
	    if(env.data.platform == "android"){
		hookHolder.postMessage(JSON.stringify(env.data));
	    }else{
		hookHolder.postMessage(env.data);
	    }
	}else{	    
	    var yo = env.data.profile.yo;
	    var me = env.data.profile.me;
	    
	    env.data.profile.me = yo;
	    env.data.profile.yo = me;

	    var yo = env.data.profile.yo;
	    var me = env.data.profile.me;
	    
	    env.data.profile.me = yo;
	    env.data.profile.yo = me;
	    server.sendMessage(env.data);
	}

    };
            
    //Received Move, Need to read the incoming format message
    var receiveMove = function(messageIn) { // hook this to a call back
	env.data = messageIn; // Store incoming message globally
	console.log(env.data);
	scenes.show();
    };

    // The following object establishes the socket connection on start up and offers the send and call back functionality.
    // Dependancies are:     <script src="/socket.io/socket.io.js"></script>
    // var server = {
    // 	init: function() {
    // 	    //a room id, this should be a hook with the chaat room id, possible random, and passed as a xmpp message for the other player to join the same room.
    // 	    var room_id = env.room ; 
    // 	    var user_id = Math.floor((Math.random() *100)+1) ; // a random number for a name. replace this with the hook for the jid
    // 	    this.connect(user_id,room_id);
    // 	    console.log("Connected to:",user_id,room_id)
    // 	},
    // 	connect: function(user_id,room_id) {
    // 	    console.log("Connecting to Server",user_id,room_id);
	    
    // 	    this.socketio = io.connect(env["socket"], {query:'roomId='+room_id+'&userId='+user_id});
	    
    // 	    this.socketio.on("server", function(data) {  //Call back for the incomming messages
    // 		if (data.type == 'connect' ) { // ignore these. Testing server.
		    
    // 		    console.log("Testing Server sent a Connect message:",data);
    // 		    if (env.connected == false) { // to stop calling when a connection is refreshed.
    // 			console.log(data);
    // 			receiveMove(env.data);
    // 			//Set a blank object like nothing happens.
    // 			env.connected = true; 
    // 		    }
    // 		} else if (data.type != "disconnect") { // so long as its not a disconnect, pass the data
    // 		    console.log("Testing Server sent a Data message:",data);
    // 		    receiveMove(data); 
    // 		}
    // 	    });
    // 	}, // connected

    // 	sendMessage: function() {
    // 	    mDropNext = false;

    // 	    // Change turn
    // 	    env.data.turn = env.data.profile.yo.uid;
	    
    // 	    // Simulate switching user
    // 	    var yo = env.data.profile.yo;
    // 	    var me = env.data.profile.me;
	    
    // 	    env.data.profile.me = yo;
    // 	    env.data.profile.yo = me;

    // 	    this.socketio.emit("client", env.data);

    // 	    // Swap back? 
    // 	    var yo = env.data.profile.yo;
    // 	    var me = env.data.profile.me;
	    
    // 	    env.data.profile.me = yo;
    // 	    env.data.profile.yo = me;
    // 	},

    // 	sendSync: function(obj) {    
    // 	    this.socketio.emit("client", obj);
    // 	}
    // };

    return{
	// server : server,
	receiveMove : receiveMove,
	sendMove : sendMove,
	closeView : closeView,
	clearDB : clearDB,
	shareFacebookURL : shareFacebookURL,
	shareFacebookImage : shareFacebookImage
    }

})();
