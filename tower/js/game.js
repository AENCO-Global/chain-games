var game;

// World size
var WorldHeight = 960;
var ScreenHeight = 960;
var offset = WorldHeight - ScreenHeight;

// Frame step and physics paramters
var timestep = 1/20.0;
var gravity = 200;
var velocityIterations = 2;
var positionIterations = 2;
var bodyDensity = 100;
var bodyRestitution = 0.1;
var friction = .1;

// Game logic
var mDropNext = true;
var currentCrate;
var lastHeight = 0;
var crates = [];
var textDisplay;

// Popup for Result
var popup;
var tween = null;
var isGameSet = false;

window.onload = function() {	
	   game = new Phaser.Game(640, ScreenHeight, Phaser.AUTO, "");
     game.state.add("PlayGame",playGame);
     game.state.start("PlayGame");
}
	
var playGame = function(game){};

playGame.prototype = {
  init: function(){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);
  },
	preload: function(){
		game.load.image("crate", "images/crate_rec2.png");
		game.load.image("crate_silver", "images/crate_rec.png"); 
		game.load.image("ground", "images/ground_Fotor.png"); 
    game.load.image("refresh", "images/refresh.png"); 
	},
  create: function(){
    // Game info text
    var text = "Click to add crate.";
    var style = { font: "24px Arial", fill: "#ff0044", align: "center" };
    textDisplay = game.add.text(game.world.centerX-300, WorldHeight - ScreenHeight, text, style);
    this.game.add.text(game.world.centerX-300, WorldHeight - 30, "P1-Purple P2-Silver", style);

    // Popup for result
    //  You can drag the pop-up window around
    popup = game.add.text(game.world.centerX, game.world.centerY, '', style);
    popup.alpha = 0.8;
    popup.anchor.set(0.5);
    popup.inputEnabled = true;    
    //  Position the close button to the top-right of the popup sprite (minus 8px for spacing)
    var pw = (popup.width / 2) - 30;
    var ph = (popup.height / 2) - 38;
    var button = game.make.sprite(pw, -ph, 'refresh');
    button.inputEnabled = true;
    button.input.priorityID = 1;
    button.events.onInputDown.add(onResetClick, this);
    popup.addChild(button);
    //  Hide it awaiting a click
    popup.scale.set(0);

    // World settings
		game.world.setBounds(0, 0, this.game.length, WorldHeight);
		this.game.camera.y = WorldHeight - ScreenHeight;
    this.dragging = false;
    this.game.input.onDown.add(this.beginMove, this);
    this.game.input.onUp.add(this.endMove, this);    
    this.game.input.addMoveCallback(this.moveCamera, this);

    this.game.stage.disableVisibilityChange = true;  // background. True = continue. False = Freeze
    this.game.stage.backgroundColor = "#222222";
    this.game.physics.startSystem(Phaser.Physics.BOX2D); // init the Box2D engine
    this.game.physics.box2d.gravity.y = gravity; //gravity
    this.game.step(timestep,velocityIterations, positionIterations); // fps

    var groundSprite = game.add.sprite(320, WorldHeight-20, "ground"); // Ground sprite, Centre
    game.physics.box2d.enable(groundSprite); // Enable physics on the body
    groundSprite.body.static = true; // Static Body Sprite
    game.input.onDown.add(this.sendCrate, this); // waiting for player input  // Originally -> game.input.onDown.add(addCrate, this);
	},
  sendCrate: function(obj){
    if (mDropNext) {
      addCrate(obj);
      sendMove(obj);
    }
  },
  update: function(){
    var status = "";
    if (currentCrate) {
      if (currentCrate.position.y < WorldHeight-20) {
        if (currentCrate.position.y != lastHeight) {
        //if (currentCrate.position.y - lastHeight > 0.1 || currentCrate.position.y - lastHeight < -0.01) {
          lastHeight = currentCrate.position.y;       
          sendSync = false;
          status = "Dropping";
        } else {         
          if (!mDropNext) {     
              status = "Waiting";              
              //Debug
              //addCrate();
          } else {
              status = "Ready";
              if(!sendSync) {
                var crateArr = [];
                for(var j=0;j<crates.length;j++){
                  crateArr[j] = {x: crates[j].position.x, y: crates[j].position.y};
                }
                server.sendSync({type: 'sync', data: crateArr});              
                sendSync = true;
              }
          }
        }
      } else {
        status = "Crash!";
        openPopup();
        var text;
        if (mIsMyTurn){
          text = "P1 ";
        } else {
          text = "P2 ";
        }
        text += "won.";
        popup.setText(text);
        isGameSet = true;
      }
    }
    textDisplay.setText("Crate number: " + crates.length + " " + status);
  },
  beginMove: function(){
    this.startY = this.game.input.y;
    this.dragging = true;
  },
  endMove: function(){
    this.dragging = false;
  },
  moveCamera: function(pointer, x, y){
    if(this.dragging){
      var delta = y - this.startY;
      this.game.camera.y -= delta;
      this.startY = y;
      offset -= delta;
      if (offset > WorldHeight - ScreenHeight) {
      	offset = WorldHeight - ScreenHeight;
      } else if (offset < 0) {
      	offset = 0;
      }
    }
  },
  render: function(){    
  }
}

function onResetClick () {
  console.log("onResetClick");
  closeWindow();
  if (isGameSet == true) {
    // reset the game
    resetGame();
    isGameSet = false;
  }
}

function resetGame() {
  currentCrate = undefined;
  for(var i=0;i<crates.length;i++){
    crates[i].destroy();
  }
  crates = [];
  mDropNext = true;
  lastHeight = 0;
}

var mIsMyTurn = true;

function addCrate(e){
	// this is how we get an array of bodies at a certain cordinate, in this case player input coordinate
	// var currentBody = game.physics.box2d.getBodiesAtPoint(e.x, e.y + offset);
	// // if there is at least one body (but it can't be more than one in this example)...
	// if(currentBody.length>0){	
	// 	// if the body is not static (it's not the ground)
	// 	if(!currentBody[0].static){
	// 		// destroy the sprite and the body
	// 		//currentBody[0].sprite.destroy();
	// 	}
	// }
	// else
  console.log(e);
  if (mDropNext)
  {
    if (false == isGameSet) {
      if (lastHeight == 0 || e.y < lastHeight) {
    		var pic = "crate";
    		if (!mIsMyTurn) {
    			pic = "crate_silver";
    		} 
    		mIsMyTurn = !mIsMyTurn;
    		// otherwise create a crate in the same way we created the ground
    		currentCrate = game.add.sprite(e.x, e.y + offset, pic);
      	//	currentCrate = game.add.sprite(320, 20, pic);
        game.physics.box2d.enable(currentCrate);
        
        // Object configs
        currentCrate.body.density = bodyDensity;
        currentCrate.body.restitution = bodyRestitution;
        currentCrate.body.friction = friction;
//        currentCrate.body.angularDamping = 1;
//        currentCrate.body.allowSleep = true;
//        currentCrate.body.velocity.x = 0;
//        currentCrate.body.velocity.y = 0;
//        currentCrate.body.bullet = true;

        currentCrate.body.fixedRotation = false; // need to rotate.

        crates.push(currentCrate);
      } else {
        console.log("below lastHeight!");
      }
    }
  }
  else {
    console.log("Not still yet.");
  }
}

function openPopup() {
    if ((tween !== null  && tween.isRunning) || popup.scale.x === 1)
    {
        return;
    }
    //  Create a tween that will pop-open the window, but only if it's not already tweening or open
    tween = game.add.tween(popup.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
}

function closeWindow() {
    if ((tween !== null  && tween.isRunning)  || popup.scale.x === 0)
    {
        return;
    }

    //  Create a tween that will close the window, but only if it's not already tweening or closed
    tween = game.add.tween(popup.scale).to( { x: 0, y: 0 }, 500, Phaser.Easing.Elastic.In, true);
}

//Send the move somewhere. maybe need to format the message into a json object....
function sendMove(obj){ // use this to send move
  var data = {type:'move' ,x : obj.x, y : obj.y};
  server.sendMessage(data);
}

//Received Move, Need to read the incoming format message
function receiveMove(obj){ // hook this to a call back
  console.log("inside receiveMove Received Move:",obj)   // implode obj to array 
  if (obj.type == 'move') {  //and not my turn?
    addCrate(obj);
  }
}

// The following object establishes the socket connection on start up and offers the send and call back functionality.
// Dependancies are:     <script src="/socket.io/socket.io.js"></script>
var server = {
  init: function() {
    var room_id = env.room ; //a room id, this should be a hook with the chaat room id, possible random, and passed as a xmpp message for the other player to join the same room.
    var user_id = Math.floor((Math.random() *100)+1) ; // a andome number for a name. replace this with the hook for the jid
    this.connect(user_id,room_id);
    console.log("Connected to:",user_id,room_id)
  },
  connect:  function(user_id,room_id) {
    console.log(user_id,room_id);
    this.socketio = io.connect(env["socket"], {query:'roomId='+room_id+'&userId='+user_id});
    this.socketio.on("server", function(data) {  //Call back for the incomming messages
      console.log(data);
      if (data.type == 'move') {     
        mDropNext = true; 
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

server.init();
