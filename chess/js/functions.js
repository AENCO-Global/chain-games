/**
 * Game logic holder
 * @class functions
 */
var functions = (function () {

    var game, board;
    var turnMade = false;

    /*=================================================
      Core game logic
      ===================================================*/
    
    /**
     * @param {Integer} column The column that was tapped.
     * @method makeMove
     */
    var makeMove = function(source, target, piece, newPosition, oldPosition){

	env.data.data.move_count = env.data.data.move_count + 1;
	
	var previous = game.fen();
	
	var move = game.move({
	    from: source,
	    to: target,
	    promotion: 'q' // NOTE: always promote to a queen for example simplicity
	});

	// Check if move is illegal and if so, short circuit

	if(move === null){
	    if(game.in_check()){
		modals.showYouAreInCheckModal();
		setTimeout(function(){
	    	    modals.killModal();
		}, 2000);
	    }
	       return 'snapback';
	}

	// $('#audio').prop("currentTime",0);
	// $('#audio')[0].play();	    

	env.data.data.last_move = source+target;
	env.data.data.game_board = previous;

	// Check for a check mate.
	if(game.in_checkmate() === true){

	    // Unbind touch events for swift people
	    $('#give-up-button').off();
	    $('#close-button').off();

	    env.data.turn = env.data.profile.yo.uid;
	    env.data.type = "end";
	    env.data.state = "move";

	    env.data.data.winner = env.data.profile.me.uid;

	    env.data.notification = "You lost the game!";
	    env.data.start_notification = "";

	    // modals.showCheckMateModal(env.data.profile.me.color);	    

	    setTimeout(function() {
		triggerGameOver('win');
	    }, 1500);

	}else if(game.in_check() === true){
	    modals.showCheckModal(env.data.profile.yo.color);
	}
	
	// Send different messages depending on game state.
	if(env.data.type == "start"){
	    env.data.type = "move";
	    env.data.state = "start";
	    env.data.turn = env.data.profile.yo.uid;

	    env.data.notification = "I sent you a game move. Play!";
	    env.data.start_notification = "I started a game.";
	    
	    setTimeout(function(){
		modals.showMoveSentModal();
		setTimeout(function(){
		    hook.closeView();
		},1000);
	    },1000);
	}
	else if(env.data.type == "move"){
	    env.data.type = "move";
	    env.data.state = "move";
	    env.data.turn = env.data.profile.yo.uid;

	    env.data.notification = "I sent you a game move. Play!";
	    env.data.start_notification = "";

	    setTimeout(function(){
		modals.showMoveSentModal();
		setTimeout(function(){
		    hook.closeView();
		},1000);
	    },1500);
 	}

	hook.sendMove();	    
    }    

    // do not pick up pieces if the game is over
    // only pick up pieces for the side to move
    var onDragStart = function(source, piece, position, orientation) {

	if (env.data.turn != env.data.profile.me.uid) {
	    modals.showWaitingModal();
	    setTimeout(function(){
	    	modals.killModal();
	    }, 2000);
	    return false;	 
	}else if (game.game_over() === true ||
	    (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
	    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
	    return false;
	}
    };

    // update the board position after the piece snap 
    // for castling, en passant, pawn promotion
    var onSnapEnd = function() {
	board.position(game.fen());
    };

    
    /**
     * 
     * @method render
     */
    var render = function() {

	console.log('Last move:', env.data.data.last_move);

	// Game logic library
	if(env.data.data.game_board === "start"){
	    game = new Chess();
	}else{
	    game = new Chess(env.data.data.game_board);
	}
		
	// Game UI library
	board = ChessBoard('board', {
	    position: env.data.data.game_board,
	    onDragStart :  onDragStart,
	    onDrop : makeMove,
	    onSnapEnd : onSnapEnd,
	    draggable: true,
	    sparePieces: false,
	    orientation:env.data.profile.me.color,
	    appearSpeed:'fast',
	    moveSpeed: 'slow',
	    snapbackSpeed: 500,
	    snapSpeed: 100,
	});

	// Turn UI
	if (env.data.turn == env.data.profile.me.uid) {
	    $("#players-message-box").text("Your turn!");
	}else{
	    $("#players-message-box").text(env.data.profile.yo.name + "'s turn!");
	}

	// Update player labels 
	$("#player1").text(decodeURIComponent(env.data.profile.me.name));
	$("#player2").text(decodeURIComponent(env.data.profile.yo.name));

	$(".player1-image").attr("src","img/"+env.data.profile.me.color+"Pawn.png");
	$(".player2-image").attr("src","img/"+env.data.profile.yo.color+"Pawn.png");

	// Need to fix the flickering load
	if(env.data.type == 'start'){
	    template = '<div id="close-button" class="options-button">\
<span>Close</span>\
</div>';
	}else{

	    if(env.data.data.move_count == 1 && env.data.turn != env.data.profile.me.uid){

		template = '<div id="give-up-button" class="halfscreen-button left">\
<span>Cancel Game</span>\
</div>\
<div id="close-button" class="halfscreen-button right">\
<span>Close</span>\
</div>';
	    }else{
		template = '<div id="give-up-button" class="halfscreen-button left">\
<span>Give Up</span>\
</div>\
<div id="close-button" class="halfscreen-button right">\
<span>Close</span>\
</div>';
	    }
	}

	$("#game-holder").append(template)	
    }

    /**
     * 
     * @method bindEvents
     */
    var bindEvents = function(){

	$('#close-button').click(function(){
	    hook.closeView();
	});

	$('#give-up-button').click(function(){

	    if(env.data.data.move_count == 1 && env.data.turn != env.data.profile.me.uid){	    
		modals.showYesNoDialog("Are you sure you want to cancel the game?", "Yes", "No");
	    }else{
		modals.showYesNoDialog("Give up already?", "Yes", "Still can do it");
	    }
	});

	// // For those not bothered to play..
	// $('.player2-image').click(function(){

	//     env.data.turn = env.data.profile.yo.uid;
	//     env.data.type = "end";
	//     env.data.state = "move";
	//     // env.data.data.last_move = ;
	//     env.data.data.game_board = game.fen();
	//     env.data.data.winner = env.data.profile.me.uid;

	//     hook.sendMove();
	    
	//     triggerGameOver('win');

	// });
    }

    /**
     * Changes the game to the game over state by
     * showing victory screen.
     * @method triggerGameOver
     */
    var triggerGameOver = function(gameStatus){

	var template = '<div id="gameover">\
      <div id="top-message">\
	<h3 id="gamename">{{gamename}}</h3>\
	<h2 id="gamecondition">{{gamestate}}</h2>\
      </div>\
      <div id="profile-holder">\
	<div id="profile">\
	  <img src="{{player1-picture}}">\
	  <div id="profile-name">{{player1-name}}</div>\
	</div>\
	<div id="V">\
	  <h3>VS</h3>\
	</div>\
	<div id="profile">\
	  <img src="{{player2-picture}}">\
	  <div id="profile-name">{{player2-name}}</div>\
	</div>\
	<!--<div id="score">\
	  Score<br/><br/>\
	  {{player1-name-trimmed}} {{player1-score}} - {{player2-name-trimmed}} {{player2-score}}\
	</div>-->\
      </div>\
      <div id="share-button">\
	Share on Facebook!\
      </div>\
        <div id="gameover-close">\
	<div class="options-button">Close</div>\
      </div>\
</div>';
	// This split / join replaces all occurrences, not just first
	// as replace does.
	if(gameStatus == 'win'){
	    template = template.split('{{gamestate}}').join('You win!');
	}else if(gameStatus == 'loss'){
	    template = template.split('{{gamestate}}').join('You lose!');
	}

	template = template.split('{{gamename}}').join(env.data.game);
	template = template.split('{{player1-picture}}').join(env.data.profile.me.img);
	template = template.split('{{player2-picture}}').join(env.data.profile.yo.img);
	template = template.split('{{player1-name}}').join(decodeURIComponent(env.data.profile.me.name));
	template = template.split('{{player2-name}}').join(decodeURIComponent(env.data.profile.yo.name));

	var trimmed = decodeURIComponent(env.data.profile.me.name);
	if(env.data.profile.me.name.length > 9){
	    trimmed = trimmed.substr(0, 9) + "..";
	}
	
	var trimmedYo = decodeURIComponent(env.data.profile.yo.name);
	if(env.data.profile.yo.name.length > 9){
	    trimmedYo = trimmedYo.substr(0, 9) + "..";
	}
	
	template = template.split('{{player1-name-trimmed}}').join(trimmed);
	template = template.split('{{player2-name-trimmed}}').join(trimmedYo);
		
	var editedScore;
	if(gameStatus == 'win'){
	    editedScore = parseInt(env.data.profile.me.score)+1;
	    template = template.split('{{player1-score}}').join(editedScore);
	    template = template.split('{{player2-score}}').join(env.data.profile.yo.score);
	}else if(gameStatus == 'loss'){
	    editedScore = parseInt(env.data.profile.yo.score)+1;
	    template = template.split('{{player1-score}}').join(env.data.profile.me.score);
	    template = template.split('{{player2-score}}').join(editedScore);
	}

	$("#game-holder").html(template);
	
	$("#gameover-close").click(function(){
	    hook.closeView();
	});

	$("#share-button").click(function(){

	    modals.showLoadingModal();

	    var decodedMe = decodeURIComponent(env.data.profile.me.name);
	    var decodedYo = decodeURIComponent(env.data.profile.yo.name);

	    if(env.data.data.winner == env.data.profile.me.uid){
		imageMerge.resultImg(env.data.profile.me.img,decodedMe,parseInt(env.data.profile.me.score)+1,env.data.profile.yo.img,decodedYo,env.data.profile.yo.score,'./img/winbg.jpg',1,
	    		  function(myImg){ //For local image display only.

	    		      // console.log(myImg);
	    		      // $('body').html(myImg);

	    		      // console.log(myImg.toDataURL());

	    		      // hook.shareFacebookImage(myImg.toDataURL());
			      
	    		      // var c = document.getElementById("testCanvas");
	    		      // var ctx = c.getContext("2d");
	    		      // var img = myImg; 
	    		      // ctx.drawImage(img,0,0,ctx.canvas.width,ctx.canvas.height);
	    		  },
	    		  function(mimeObj){ // Mime encoded version, needs to be done in the app
	    		      var b64 = mimeObj.substring(mimeObj.indexOf(',')+1, mimeObj.length);
	    		      modals.killModal();
	    		      hook.shareFacebookImage(b64);
	    		  }
	    		 );
	    }else{
		imageMerge.resultImg(env.data.profile.me.img, decodedMe,env.data.profile.me.score,env.data.profile.yo.img,decodedYo,parseInt(env.data.profile.yo.score)+1,'./img/winbg.jpg',2,
	    		  function(myImg){ //For local image display only.

	    		      // console.log(myImg);
	    		      // $('body').html(myImg);

	    		      // console.log(myImg.toDataURL());

	    		      // hook.shareFacebookImage(myImg.toDataURL());
			      
	    		      // var c = document.getElementById("testCanvas");
	    		      // var ctx = c.getContext("2d");
	    		      // var img = myImg; 
	    		      // ctx.drawImage(img,0,0,ctx.canvas.width,ctx.canvas.height);
	    		  },
	    		  function(mimeObj){ // Mime encoded version, needs to be done in the app
	    		      var b64 = mimeObj.substring(mimeObj.indexOf(',')+1, mimeObj.length);
	    		      modals.killModal();
	    		      hook.shareFacebookImage(b64);
	    		  }
	    		 );
	    }


	});

	// $('#audio-win').prop("currentTime",0);
	// $('#audio-win')[0].play();	    
    }      
    
    /**
     * Replays the last move in the UI for the benefit of the receiving player.
     * @method showLastMove
     */
    var showLastMove = function(){
	var source = env.data.data.last_move.substring(0,2);
	var target = env.data.data.last_move.substring(2,4);

	game.move({
	    from : source,
	    to: target,
	    promotion: 'q'
	});

	board.move(source+'-'+target);

	setTimeout(function(){
	    board = ChessBoard('board', {
	    	position: game.fen(),
	    	onDragStart :  onDragStart,
	    	onDrop : makeMove,
	    	onSnapEnd : onSnapEnd,
	    	draggable: true,
	    	sparePieces: false,
	    	orientation:env.data.profile.me.color,
	    	appearSpeed:'fast',
	    	moveSpeed: 'slow',
	    	snapbackSpeed: 500,
	    	snapSpeed: 100,
	    });
	},600);
	
    }

    var checkGameover = function(){

	if(game.in_check() === true){
	    modals.showCheckModal(env.data.profile.me.color);
	}

	if(game.in_checkmate() === true){
	    
	    // modals.showCheckMateModal(env.data.profile.me.color);	    
	    setTimeout(function() {
		// modals.killModal();
		triggerGameOver('loss');
	    }, 1000);
	    
 	}

    }
    
    /*=================================================
      Convenience/FUN
      ===================================================*/

    /**
     * Prints out the current game state in a readable way.
     * Currently a stub only
     * @method printGameReadable
     */
    var printGameReadable = function(){
	console.log('STUB');
    }

    
    // All unreturned methods are private by default.
    return{

	triggerGameOver: triggerGameOver,

	/* UI related */
	render: render,
	makeMove: makeMove,
	showLastMove: showLastMove,
	bindEvents: bindEvents,
	checkGameover : checkGameover,
    }

}());
