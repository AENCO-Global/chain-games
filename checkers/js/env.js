
var env = [];

env.piece =
    {
	"purple": "1",
	"purpleK": "3",
	"yellow": "2",
	"yellowK": "4"
    }

env.server = "dev-ap-games.chaatz.com";
env.port = '8001';
env.socket = env.server+':'+env.port;		
env.room = 'checkers';
env.user = Math.floor((Math.random() *1000)+1);
env.version = "{{version}}";
env.connected = false;

env.data =
    {
	"game": "checkers",
	"platform" : "",
	"gid": "",
	"type":"start",
	"state": "",
	"turn": "U001",
	"data":{
	    "game_board":"000000000000000000000000000000000000000000",
	},
	"profile":{
	    "me": {"uid":"U001", "name":"Nick","img":"","color":"red","LOC":"", "score":1},
	    "yo": {"uid":"U002", "name":"Irfan","img":"","color":"yellow","LOC":"","score":2}	
	},
	"version":"V1.2.003",
	"mid":0,
    }
