/**
 * Game logic holder
 * @class functions
 */
var functions = (function () {

    // Holds current game in array form
    var currentGame;
    
    /**
     * Called when the user taps a column.
     * - Appends a token HTML block to the DOM at the column div location. 
     * - Runs a jQuery animation of the token falling to the bottom.
     * - After the animation, the 2D array that represents the game is updated.
     * - A check is performed to see if anybody has won.
     * - my_turn boolean is set to false, preventing another turn.
     * - UI is updated.
     * @param {Integer} column The column that was tapped.
     * @method makeMove
     */
    var makeMove = function(game, column){
	
	// Check if below is necessary
	game.data.move_count = game.data.move_count + 1;

	// refactor below depends on CSS refactor
	if(game.profile.me.color == 'yellow'){
	    var currentColumn = $('#column-'+column);
	    var token = '<img width="100%" src="img/'+game.profile.me.color+'_button.png" class="token y-token-animation-'+getColumnHeight(column)+'">';
	    currentColumn.append(token); 	    
	}
	else if(game.profile.me.color == 'red'){
	    var currentColumn = $('#column-'+column);
	    var token = '<img width="100%" src="img/'+game.profile.me.color+'_button.png" class="red-token r-token-animation-'+getColumnHeight(column)+'">';
	    currentColumn.append(token); 	    
	}

	// Update game state
	updateGameArray(column, game.profile.me.color);

	// Check for a game over. 
	if(gameOver(currentGame)){
	    game.type = "end";
	    setTimeout(function(){
		triggerGameOver(game, 'win');
	    }, 2500);
	}
	game.data.last_move = column;
	game.data.game_board = functions.packageGameToString(currentGame);
	game.turn = game.profile.yo.uid;
	
	nativeBridge.sendMove(game);
    }

    /**
     * Changes the game's 2D array to match the move made.
     * Only traverses the column that was tapped.
     * @param {Integer} column The column that was tapped.
     * @method updateGameArray
     */
    var updateGameArray = function(column, color){

	// Traverse the game rows
	for (var row = 0; row <= 5; row++) {

    	    // Place token on top of an existing pillar case.
    	    if(currentGame[row][column] != 0){

		currentGame[row-1][column] = env.tokens[color];
		break;
    	    }

    	    // Place token in empty column case.
    	    if(row == 5 && currentGame[row][column] == 0) {
		currentGame[row][column] = env.tokens[color];
		break;
    	    }
	}
    }

    /**
     * Calculates the column height (number of tokens within a column).
     * @param {Integer} column The column that was tapped.
     * @method getColumnHeight
     * @return {Integer} columnHeight - The height of the column in tokens.
     */
    var getColumnHeight = function(column){

	var columnHeight = 0;
	
	for (var x = 0; x <= 5; x++) {

	    if(currentGame[x][column] != 0){

		columnHeight = 6-x;
		break;
	    }
	}	
	return columnHeight;
    }
    
    /**
     * Renders the game UI based on the game data in the packet.
     * The UI includes:
     * - Tokens
     * - My turn box
     * - Player info
     * @method render
     */
    var render = function(game) {

	var currentColumn;
	var token;

	// Traverse 2D array appending tokens in relevent places.
	for (var x = 0; x <= 5; x++) {
            for (var y = 0; y <= 6; y++) {

		if (currentGame[x][y] == env.tokens.red) {
		    var token = '<img width="100%" src="img/red_button.png" class="token r-token-'+x+'">';
		    currentColumn = $('#column-'+y);
		    currentColumn.append(token)
		}
		if (currentGame[x][y] == env.tokens.yellow) {
		    var token = '<img width="100%" src="img/yellow_button.png" class="token y-token-'+x+'">';		    
		    currentColumn = $('#column-'+y);
		    currentColumn.append(token)
		}
            }
	}

	// Update player labels 
	$("#player1").text(decodeURIComponent(game.profile.me.name));
	$("#player2").text(decodeURIComponent(game.profile.yo.name));

	$(".player1-image").attr("src","img/"+game.profile.me.color+"_button.png");
	$(".player2-image").attr("src","img/"+game.profile.yo.color+"_button.png");

	var template;

	// Need to fix the flickering load
	if(game.type == 'start'){
	    template = '<div id="close-button" class="options-button">\
<span>Close</span>\
</div>';
	}else{

	    if(game.data.move_count == 1 && game.turn != game.profile.me.uid){

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
     * Add jQuery click listeners to the columns.
     * Note: in the css I have added pointer-events:none
     * so click events go through overlaid UI elements
     * @method bindEvents
     */
    var bindEvents = function(game){

	// Unbind, mainly for browser case..

	var turnMade = false;
	
	// Event handler for tapping on any column.
	$('.column').click(function(event){
	    var column = event.target.id.slice(-1);

	    if(game.turn != game.profile.me.uid){
		modals.showWaitingModal();
		setTimeout(function(){
	    	    modals.killModal();
		}, 2000);
	    }else if(game.turn == game.profile.me.uid && getColumnHeight(column) < 6){
		if(turnMade === false){
		    // $('#audio').prop("currentTime",0);
		    // $('#audio')[0].play();	    		    
		    turnMade = true;
    		    makeMove(game, parseInt(column));
		}
		
    	    }
	});

	$('#close-button').click(function(){
	    nativeBridge.closeView(game);
	});

	$('#give-up-button').click(function(){

	    if(game.data.move_count == 1 && game.turn != game.profile.me.uid){	    
		modals.showYesNoDialog("Are you sure you want to cancel the game?", "Yes", "No");
	    }else{
		modals.showYesNoDialog("Give up already?", "Yes", "Still can do it");
	    }
	    
	});

	// For those not bothered to play..
	// $('.player2-image').click(function(){

	//     game.turn = game.profile.yo.uid;
	//     game.type = "end";
	//     game.state = "move";
	//     // game.data.last_move = ;
	//     game.data.winner = game.profile.me.uid;

	//     nativeBridge.sendMove();
	    
	//     triggerGameOver('win');

	// });

    }

    /**
     * Checks the game's 2D array to see if anybody has won.
     * If a winner is found, a game over is triggered.
     * @method gameOver
     * @return {Boolean} gameOverStatus - True if a game is over.
     */
    var gameOver = function(game){

	var gameOverStatus = false;
	var availableSpace = false;

	for (var x = 0; x <= 5; x++) {
            for (var y = 0; y <= 6; y++) {

		try{

		    if(game[x][y] == 0){
			availableSpace = true
		    }

		    // Check horizontal win
		    if(game[x][y] != 0 &&
		       game[x][y] == game[x][y+1] &&
		       game[x][y] == game[x][y+2] &&
		       game[x][y] == game[x][y+3]){
			winner = game[x][y];
			gameOverStatus = true;
			break;
    		    }

		    // Check vertical win
		    if(game[x][y] != 0 &&
		       game[x][y] == game[x-1][y] &&
		       game[x][y] == game[x-2][y] &&
		       game[x][y] == game[x-3][y]){
			winner = game[x][y];
			gameOverStatus = true;
			break;
		    }

		    // Check diagonally left win
		    if(game[x][y] != 0 &&
		       game[x][y] == game[x-1][y-1] &&
		       game[x][y] == game[x-2][y-2] &&
		       game[x][y] == game[x-3][y-3]){
			winner = game[x][y];
			gameOverStatus = true;
			break;
		    }

		    // Check diagonally right win
		    if(game[x][y] != 0 &&
		       game[x][y] == game[x+1][y-1] &&
		       game[x][y] == game[x+2][y-2] &&
		       game[x][y] == game[x+3][y-3]){
			winner = game[x][y];
			gameOverStatus = true;
			break;
		    }
		    
		}catch(ex){
		    // We lazily handle exceptions here (Trying to traverse non-existent elements)
		}		
    	    }
	}

	if(!availableSpace){
	    gameOverStatus = true;
	}
	
	return gameOverStatus;
    }

    /**
     * Changes the game to the game over state by
     * showing victory screen.
     * @method triggerGameOver
     */
    var triggerGameOver = function(game, gameStatus){

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

	template = template.split('{{gamename}}').join(game.data.game);	
	template = template.split('{{player1-picture}}').join(game.profile.me.img);
	template = template.split('{{player2-picture}}').join(game.profile.yo.img);
	
	template = template.split('{{player1-name}}').join(decodeURIComponent(game.profile.me.name));
	template = template.split('{{player2-name}}').join(decodeURIComponent(game.profile.yo.name));

	var trimmed = decodeURIComponent(game.profile.me.name);
	if(game.profile.me.name.length > 9){
	    trimmed = trimmed.substr(0, 9) + "..";
	}
	
	var trimmedYo = decodeURIComponent(game.profile.yo.name);
	if(game.profile.yo.name.length > 9){
	    trimmedYo = trimmedYo.substr(0, 9) + "..";
	}
	
	template = template.split('{{player1-name-trimmed}}').join(trimmed);
	template = template.split('{{player2-name-trimmed}}').join(trimmedYo);

	var editedScore;
	if(gameStatus == 'win'){
	    editedScore = parseInt(game.profile.me.score)+1;
	    template = template.split('{{player1-score}}').join(editedScore);
	    template = template.split('{{player2-score}}').join(game.profile.yo.score);
	}else if(gameStatus == 'loss'){
	    editedScore = parseInt(game.profile.yo.score)+1;
	    template = template.split('{{player1-score}}').join(game.profile.me.score);
	    template = template.split('{{player2-score}}').join(editedScore);
	}

	$("#game-holder").html(template);

	$("#gameover-close").click(function(){	  	    
	    nativeBridge.closeView(game);
	});

	$("#share-button").click(function(){

	    modals.showLoadingModal();

	    var decodedMe = decodeURIComponent(game.profile.me.name);
	    var decodedYo = decodeURIComponent(game.profile.yo.name);

	    if(game.data.winner == game.profile.me.uid){
		
		imageMerge.resultImg(game.profile.me.img, decodedMe,parseInt(game.profile.me.score)+1,game.profile.yo.img,decodedYo,game.profile.yo.score,'./img/winbg.jpg',1,
	    		  function(myImg){ //For local image display only.

	    		      // console.log(myImg);
	    		      // $('body').html(myImg);

	    		      // console.log(myImg.toDataURL());

	    		      // nativeBridge.shareFacebookImage(myImg.toDataURL());
			      
	    		      // var c = document.getElementById("testCanvas");
	    		      // var ctx = c.getContext("2d");
	    		      // var img = myImg; 
	    		      // ctx.drawImage(img,0,0,ctx.canvas.width,ctx.canvas.height);
	    		  },
	    		  function(mimeObj){ // Mime encoded version, needs to be done in the app
	    		      var b64 = mimeObj.substring(mimeObj.indexOf(',')+1, mimeObj.length);
	    		      modals.killModal();
	    		      nativeBridge.shareFacebookImage(b64);
	    		  }
	    		 );
	    }else{
		imageMerge.resultImg(game.profile.me.img,decodedMe,game.profile.me.score,game.profile.yo.img,decodedYo,parseInt(game.profile.yo.score)+1,'./img/winbg.jpg',2,
	    		  function(myImg){ //For local image display only.

	    		      // console.log(myImg);
	    		      // $('body').html(myImg);

	    		      // console.log(myImg.toDataURL());

	    		      // nativeBridge.shareFacebookImage(myImg.toDataURL());
			      
	    		      // var c = document.getElementById("testCanvas");
	    		      // var ctx = c.getContext("2d");
	    		      // var img = myImg; 
	    		      // ctx.drawImage(img,0,0,ctx.canvas.width,ctx.canvas.height);
	    		  },
	    		  function(mimeObj){ // Mime encoded version, needs to be done in the app
	    		      var b64 = mimeObj.substring(mimeObj.indexOf(',')+1, mimeObj.length);
	    		      modals.killModal();
	    		      nativeBridge.shareFacebookImage(b64);
	    		  }
	    		 );
	    }


	});

	// $('#audio-win').prop("currentTime",0);
	// $('#audio-win')[0].play();	    
    }

    
    /**
     * Replays the last move in the UI for the benefit of the receiving player.
     * @param {Integer} column The column that contains the last move
     * @param {Integer} color The color of the last move
     * @method replayLastMove
     */
    var replayLastMove = function(game){

	setTimeout(function(){
	    modals.showReplayModal(game);
	},700);

	removeLastMove(game.data.last_move);
	
	var column = game.data.last_move;

	setTimeout(function(){

	    // Rewrite! 
	    if(game.data.winner == game.profile.me.uid){
		if(game.profile.me.color == 'yellow'){
		    var currentColumn = $('#column-'+column);
		    var token = '<img width="100%" src="img/'+game.profile.me.color+'_button.png" class="token y-token-animation-'+getColumnHeight(column)+'">';
		    currentColumn.append(token); 	    
		}
		else if(game.profile.me.color == 'red'){
		    var currentColumn = $('#column-'+column);
		    var token = '<img width="100%" src="img/'+game.profile.me.color+'_button.png" class="red-token r-token-animation-'+getColumnHeight(column)+'">';
		    currentColumn.append(token); 	    
		}

	    }else{	    
		if(game.profile.yo.color == 'yellow'){
		    var currentColumn = $('#column-'+column);
		    var token = '<img width="100%" src="img/'+game.profile.yo.color+'_button.png" class="token y-token-animation-'+getColumnHeight(column)+'">';
		    currentColumn.append(token); 	    
		}
		else if(game.profile.yo.color == 'red'){
		    var currentColumn = $('#column-'+column);
		    var token = '<img width="100%" src="img/'+game.profile.yo.color+'_button.png" class="red-token r-token-animation-'+getColumnHeight(column)+'">';
		    currentColumn.append(token); 	    
		}
	    }
	    	    
	    // Update game state
	    updateGameArray(column, game.profile.yo.color);
	}, 2400);
    }

    /**
     * Removes the last moves token from the incoming data
     * allowing us to replay it on the receivers end.
     * @param {Integer} column
     * @method removeLastMove
     */
    var removeLastMove = function(column){
	
	// Store whether it was red or yellow token.
	var lastMoveColor = currentGame[6-getColumnHeight(column)][column];

	// Remove topmost token from last column
	currentGame[6-getColumnHeight(column)][column] = 0;

	return lastMoveColor;
    }


    /**
     * Returns the string representation of the game's 2D array.
     * Removes commas.
     * @param {Array} game
     * @method packageGameToString
     * @return {String} 
     */
    var packageGameToString = function(game){
	return game.toString().replace(/,/g, '')
    }

    /**
     * Takes the string representation of the game and
     * returns a 2D array representing the game.
     * Basic checking (if the input string is less than 42 chars
     * it will default).
     * @param {String} game
     * @method loadGameFromString
     * @return {Array} 
     */
    var loadGameFromString = function(game){

	// Do validation (elaborate)
	if(game.length != 42){
	    game = '000000000000000000000000000000000000000000';
	}

	// Split every 7 characters
	splitArray = game.match(/.{1,7}/g);

	// Store results
	var result = [];

	for(var i=0; i<splitArray.length; i++){
    	    // We want an array of characters, so split and repackage
    	    char_array = splitArray[i].split("");
    	    result.push(char_array);
	}

	return result;
    }

    /**
     * @method loadGame
     */
    var loadGame = function(game){
	currentGame = loadGameFromString(game);
    }

    /**
     * Prints out the current game state in a readable way.
     * Currently a stub only
     * @method printGameReadable
     */
    var printGameReadable = function(){
    }

    /**
     * Prints out the current game state in a readable way.
     * Currently a stub only
     * @method printGameReadable
     */
    var initializeGameData = function(game){
    	game.data.game_board = "000000000000000000000000000000000000000000";
    	game.data.move_count = 0;
    	game.turn = game.profile.me.uid;
    	game.profile.me.color = "red";
    	game.profile.yo.color = "yellow";

	if(game.profile.me.img == ""){
    	    game.profile.me.img = "img/user.jpg"
	}

	if(game.profile.yo.img == ""){
    	    game.profile.yo.img = "img/user.jpg"
	}

	// Notifications..
	game.notification = "";
	game.start_notification = "";
    }

    
    // All unreturned methods are private by default.
    return{

	triggerGameOver: triggerGameOver,

	/* UI related */
	render: render,
	makeMove: makeMove,
	bindEvents: bindEvents,
	
	/* Persistence */
	packageGameToString: packageGameToString,
	loadGameFromString: loadGameFromString,

	replayLastMove : replayLastMove,
	/* Networking */

	initializeGameData : initializeGameData,

	loadGame : loadGame
    }

}());
