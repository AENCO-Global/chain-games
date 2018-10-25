var env = [];
	env.server = "#"; //"dev-ap-games.aencoin.io";	//change this from the server
	env.port = '8001'; 								//change from the deployment
	env.socket = env.server+':'+env.port;		
	env.room = 'Room-001';  //Default
	env.user = Math.floor((Math.random() *1000)+1) ;  // A random default
	env.version = "{{version}}" ;  // A random default
