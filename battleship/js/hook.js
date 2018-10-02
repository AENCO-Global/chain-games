/**
 * Component for interfacing with native Android or iOS application.
 * @class hook
 */
var native; // Make it Globally available.

// Hook call back in global scope.
function onReceiveMessage(json){
//	alert(json);
    var parsedData = JSON.parse(json);
    hook.receiveMove(parsedData);
}

var hook  = (function () {
	
	var init = function(){
		// initialise the Native Hooks
		try { // Use the xmpp
			native = window.webkit.messageHandlers.native;
			env.commsMethod = 'xmpp';
		} catch(err) { //No xmpp available, so set for websocket
			env.commsMethod = 'socket';
			server.init();
			console.log("No XMPP:Using websocket for testing");
		}
	}

    // to be a call back function to close the view
    var closeView = function(from){
		setTimeout(function() {
			try {
			    var message = {"closewebview": true};
			    native.postMessage(message);
			} catch (err) { // Simulate closeing browser....
				window.location.reload();
			}
		}, env.popupTimeout/2);
    };

	var clearData = function() {
		var message = {"cleardata": true };
		try {
			native.postMessage(message);
		} catch(err) {
			alert('Clear Data Failed');
			console.log("Failed to call Clear Data Native...");
		}
	};

    var shareFacebookURL = function(){
		var message = {"facebooksharelink": "http://google.com"}
		try{
		    hookHolder.postMessage(message);
		}catch(err){
		    console.log(err)
		}
    }
    
    var shareFacebookImage = function(b64img){

		var message = {"facebookshare": b64img}
		try{
		    hookHolder.postMessage(message);
		}catch(err){
		    // alert(err);
		}
    }



    //Send the move somewhere. maybe need to format the message into a json object....
    var sendMove = function() {
    	env.conflict = false;
    	console.log("Sending Move");
		env.data.turn = env.data.profile.yo.uid ; //set the other players turn

		if ('xmpp' == 	env.commsMethod )  {
			native.postMessage(env.data);
		} else if ('socket' == 	env.commsMethod )  {

			// Swap the you and me data round.
		    var yo = env.data.profile.yo;
		    var me = env.data.profile.me;
		    env.data.profile.me = yo;
		    env.data.profile.yo = me;

			server.sendMessage(env.data);
		} else {
			modals.showNotice("No Communications Available");
			if (env.autoClose  == true) { // Maybe a switch to
				closeView('sendMove');
			}  else { 
				scenes.show();
			}
		}
    };

 
    //Received Move, Need to read the incoming format message
    var receiveMove = function(messageIn) { // hook this to a call back
	    // Check for Conflict
	    // If the current data is start, and the in data is move, We are Fucked.

	    console.log("inside receive ... ",messageIn);
	    // debugger;
	    
	    if ('start' == env.data.type && 'move' == messageIn.type) { // Merge the shit here.
	    	env.conflict = true;
	    	env.data.data[env.data.profile.yo.uid] = messageIn.data[env.data.profile.yo.uid] ;
	    } else {
	    	
			env.data = messageIn; // the global user and his data
	    }


		if (jQuery.isEmptyObject(messageIn) ) { // This Sucks, We got Nothing
		    console.log("Nothing Received, so Somthing went awry; Exit Game");
		}
	   	scenes.show();
    };

    // The following object establishes the socket connection on start up and offers the send and call back functionality.
    // Dependancies are:     <script src="/socket.io/socket.io.js"></script>
    var server = {
		init: function() {
		    var room_id = env.room ; //a room id, this should be a hook with the chaat room id, possible random, and passed as a xmpp message for the other player to join the same room.
		    var user_id = Math.floor((Math.random() *100)+1) ; // a random number for a name. replace this with the hook for the jid
		    this.connect(user_id,room_id);
		    console.log("Connected to:",user_id,room_id)
		},

		connect: function(user_id,room_id) {
		    console.log("Connecting to Server",user_id,room_id);
		    
		    this.socketio = io.connect(env["socket"], {query:'roomId='+room_id+'&userId='+user_id});
		    
		    this.socketio.on("server", function(data) {  //Call back for the incomming messages
			if (data.type == 'connect' ) { // ignore these. Testing server.
			    console.log("Testing Server sent a Connect message:",data);
			    if (env.connected == false) { // to stop calling when a connection is refreshed.
				var defData = env.defaultData; // set some default data
				defData.turn = defData.profile.me.uid;
				receiveMove(defData);  //Set a blank object like nothing happens.
				env.connected = true; 
			    }
			} else if (data.type != "disconnect") { // so long as its not a disconnect, pass the data
			    console.log("Testing Server sent a Data message:",data);
			    receiveMove(data); 
			}
		    });
		}, // connected

		sendMessage: function(obj) {
		    mDropNext = false;

		    this.socketio.emit("client", obj);//{ data : game_move});
		},

		sendSync: function(obj) {    
		    this.socketio.emit("client", obj);
		}
    };

    return{
	    init: init,
		receiveMove : receiveMove,
		sendMove : sendMove,
		server : server,
		clearData : clearData,
		closeView : closeView,
		shareFacebookURL : shareFacebookURL,
		shareFacebookImage : shareFacebookImage
    }

})();