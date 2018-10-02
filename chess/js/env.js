
var env = [];

env.server = "dev-ap-games.chaatz.com";
env.port = '8001';
env.socket = env.server+':'+env.port;		
env.room = 'chess';  
env.user = Math.floor((Math.random() *1000)+1);
env.version = "{{version}}";
env.connected = false;

env.data =
    {
	"game": "chess",
	"gid": "",
	"type":"start",
	"state": "",
	"turn": "U001",
	"data":{
	    "last_move":"",
	    "game_board":"start"
	},
	"profile":{
	    "me": {"uid":"U001", "name":"Nick","img":"","color":"white","LOC":""},
	    "yo": {"uid":"U002", "name":"Irfan","img":"","color":"black","LOC":""}	
	},
	"version":"V1.2.003"
    }
