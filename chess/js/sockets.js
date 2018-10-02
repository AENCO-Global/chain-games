
/**
 * Temp
 * @class socks
 */
var socks = (function () {

    var socket;

    var init = function(){
	var room_id = "test";
	var user_id = Math.floor((Math.random() *100)+1);
	connect(user_id,room_id);
	console.log("Connected to:",user_id,room_id)
    };

    var connect = function(user_id, room_id){
	
	console.log("Connecting to Server",user_id,room_id);
	socket = io.connect("dev-ap-games.chaatz.com:8001", {query:'roomId='+room_id+'&userId='+user_id});
	
	socket.on("server", function(data){
	    if (data.type == 'connect'){ 
		console.log("Testing Server sent a Connect message:",data);
		receiveMove(data);
	    } else if (data.type != "disconnect") { 
		receiveMove(data); 
	    }
	});
    }

    var receiveMove = function(json){ // hook this to a call back

	console.log('????');

	if(json.type == "invite"){
	    console.log(json);
	    functions.showLastMove(json.data.last_move);
	}

	my_turn = true;
	
    }

    var sendMessage = function(json, column){
	console.log('sendMessage');
	socket.emit("client", json);
    }

    return {
	init : init,
	sendMessage : sendMessage
    }
}());

