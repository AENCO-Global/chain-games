
var env = [];

env.tokens =
    {
	"red": "1",
	"yellow": "2"
    }

env.server = "dev-ap-games.chaatz.com";
env.port = '8001';
env.socket = env.server+':'+env.port;		
env.room = 'connect4';
env.user = Math.floor((Math.random() *1000)+1);
env.version = "{{version}}";
env.connected = false;

env.data =
    {
	"game": "connect4",
	"platform" : "",
	"gid": "",
	"type":"start",
	"state": "",
	"turn": "U001",
	"data":{
	    "last_move":"",
	    "game_board":"000000000000000000000000000000000000000000",
	    // "game_board":"011111111111111111111111111111111111111111", 
	    // "game_board":"222222222222222222222222222222222222222222",
	    // "game_board":"122211122211122211122211122211122211122211",
	},
	"profile":{
	    "me": {"uid":"U001", "name":"Nick","img":"","color":"red","LOC":"", "score":1},
	    "yo": {"uid":"U002", "name":"Irfan","img":"","color":"yellow","LOC":"","score":2}	
	},
	"version":"V1.2.003",
	"mid":0,
    }
