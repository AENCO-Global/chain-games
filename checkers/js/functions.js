/**
 * game logic holder
 * @class functions
 */
var functions = (function () {

    // Holds current game as 2D array
    var currentGame;
    var movesMade = [];
    var moveMade = false;
    var movesList = [];
    var didCapture = false;
    var currentMove;
    
    /**
     * Called on piece drop. 
     * @method makeMove
     */
    var makeMove = function(game){	

	console.log('Moves to send:');
	console.log(movesMade);

	$('.draggable').off();

	didCapture = false;
	currentMove = null;

	// Check for a game over. 
	if(gameOver(game)){
	    game.type = "end";
	    setTimeout(function(){
		triggerGameOver(game, 'win');
	    }, 2500);
	}

	// Flip the array for player 2
	currentGame.reverse().forEach(function(item) { item.reverse(); } );
	
	console.log('Moves made!');

	game.data.game_board = functions.packageGameToString(currentGame);
	// game.data.last_move_source = move.from;
	// game.data.last_move_target = move.to;
	game.turn = game.profile.yo.uid;
	game.data.move_count = game.data.move_count + 1;

	movesMade = [];
	
	nativeBridge.sendMove(game);
    }

    /**
     * 1) If NOT my piece: break (handled ondrag I guess)
     * 2) If target square is not diagonal from my current location OR the location	
     * of any enemy piece in the same direction BREAK
     * 3) If target square contains an enemy piece, reject
     * 4) If target square is empty: place piece in square
     * and update game array
     * Returns null if move is invalid.
     * @method validMove
     */
    var validMove = function(game, move){

	var currentSquareX = parseInt(move.from[0]);
	var currentSquareY = parseInt(move.from[1]);
	var targetSquareX = parseInt(move.to[0]);
	var targetSquareY = parseInt(move.to[1]);
	var target = "" + targetSquareX+targetSquareY;

	var isKing = false;
	if(currentGame[currentSquareX][currentSquareY] == "3" ||
	   currentGame[currentSquareX][currentSquareY] == "4"){
	    isKing = true;
	    move.isKing = true;
	}

	// console.log("");
	// console.log('current (' +currentSquareX +','+ currentSquareY+')');
	// console.log('target (' +targetSquareX +','+ targetSquareY+')');
	// console.log("");

	var validMove // refactor later


	for (var x = 1; x <= 7; x++) {

	    // Top right
	    if(targetSquareX == currentSquareX-x && targetSquareY == currentSquareY+x){

	    	// Adjacent top right and empty
	    	if(targetSquareX == currentSquareX-1 && 
	    	   targetSquareY == currentSquareY+1 &&
	    	   currentGame[targetSquareX][targetSquareY] == 0)
	    	{
	    	    validMove = true;
	    	}

	    	// Adjacent ^2 
	    	if(targetSquareX == currentSquareX-2 && 
	    	   targetSquareY == currentSquareY+2 &&
		   currentGame[targetSquareX][targetSquareY] == 0)
	    	{
	    	    if((currentGame[currentSquareX-1][currentSquareY+1] == env.piece[game.profile.yo.color] ||
		       currentGame[currentSquareX-1][currentSquareY+1] == env.piece[game.profile.yo.color+"K"])){
	    		console.log('Capture piece TR');
	    		currentGame[currentSquareX-1][currentSquareY+1] = "0";
			didCapture = true;
	    		validMove = true;
	    	    }
	    	}		
	    }

	    // Top left
	    if(targetSquareX == currentSquareX-x && targetSquareY == currentSquareY-x){

	    	// Adjacent top left and empty
	    	if(targetSquareX == currentSquareX-1 && 
	    	   targetSquareY == currentSquareY-1 &&
	    	   currentGame[targetSquareX][targetSquareY] == 0)
	    	{
	    	    console.log('top left adjacent');
	    	    validMove = true;
	    	}

	    	// Adjacent ^2 
	    	if(targetSquareX == currentSquareX-2 && 
	    	   targetSquareY == currentSquareY-2 &&
	    	   currentGame[targetSquareX][targetSquareY] == 0)
	    	{
	    	    if((currentGame[currentSquareX-1][currentSquareY-1] == env.piece[game.profile.yo.color] ||
		       currentGame[currentSquareX-1][currentSquareY-1] == env.piece[game.profile.yo.color+"K"])){
	    		console.log('Capture piece TL');
	    		currentGame[currentSquareX-1][currentSquareY-1] = "0";
			didCapture = true;
	    		validMove = true;
	    	    }
	    	}		
	    }
	    
	    // Bottom right
	    if(isKing &&
	       targetSquareX == currentSquareX+x &&
	       targetSquareY == currentSquareY+x){

		// Adjacent bottom right and empty
		if(targetSquareX == currentSquareX+1 && 
		   targetSquareY == currentSquareY+1 &&
		   currentGame[targetSquareX][targetSquareY] == 0)
		{
		    console.log('bottom right adjacent');
		    validMove = true;
		}

		// Adjacent ^2 
		if(targetSquareX == currentSquareX+2 && 
		   targetSquareY == currentSquareY+2 &&
	    	   currentGame[targetSquareX][targetSquareY] == 0)
		{

		    if((currentGame[currentSquareX+1][currentSquareY+1] == env.piece[game.profile.yo.color] ||
		       currentGame[currentSquareX+1][currentSquareY+1] == env.piece[game.profile.yo.color+"K"])){
			console.log('Capture piece BR');
			currentGame[currentSquareX+1][currentSquareY+1] = "0";
			didCapture = true;
			validMove = true;
		    }

		}		
	    }

	    // Bottom left
	    if(isKing &&
	       targetSquareX == currentSquareX+x &&
	       targetSquareY == currentSquareY-x){

		// Adjacent bottom left and empty
		if(targetSquareX == currentSquareX+1 && 
		   targetSquareY == currentSquareY-1 &&
		   currentGame[targetSquareX][targetSquareY] == 0)
		{
		    console.log('bottom left adjacent');
		    validMove = true;
		}

		// Adjacent ^2 
		if(targetSquareX == currentSquareX+2 && 
		   targetSquareY == currentSquareY-2 &&
		   currentGame[targetSquareX][targetSquareY] == 0)
		{
		    if((currentGame[currentSquareX+1][currentSquareY-1] == env.piece[game.profile.yo.color] ||
		       currentGame[currentSquareX+1][currentSquareY-1] == env.piece[game.profile.yo.color+"K"])){
			console.log('Capture piece BL');
			currentGame[currentSquareX+1][currentSquareY-1] = "0";
			didCapture = true;
			validMove = true;
		    }
		}		
	    }
	    
	}

	if(!validMove){
	    return null;
	}

	console.log("");

	return move;
    }    

    /**
     * Changes the game's 2D array to match the move made.
     * @method updateGameArray
     */
    var updateGameArray = function(game, move){
	
	// Empty previous square
	currentGame[move.from[0]][move.from[1]] = "0";

	// If opposite end of the game board, promote the piece to king
	(move.to[0] == "0" && !move.isKing) ?
	    currentGame[move.to[0]][move.to[1]] = env.piece[game.profile.me.color+"K"]:

	(move.isKing) ?
	    currentGame[move.to[0]][move.to[1]] = env.piece[game.profile.me.color+"K"]:
	    currentGame[move.to[0]][move.to[1]] = env.piece[game.profile.me.color];
    }

    function dragMoveListener (event) {
	var target = event.target,
	// keep the dragged position in the data-x/data-y attributes
	x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
	y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	// translate the element
	target.style.webkitTransform =
	    target.style.transform =
	    'translate(' + x + 'px, ' + y + 'px)';

	// update the position attributes
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
    }
    
    
    /**
     * Renders the game UI based on the game data in the packet.
     * Different for each game.
     * Refactor: should really build the whole UI and append at once.
     * @method render
     */
    var render = function(game) {

	// Mostly for browser case
 	$('#column-holder').empty();
	$('#column-holder').append('<div id="frame"></div>');
	$("#column-holder").append('<img id="gameboard" src="img/gameboard.png"/>');

	if(game.turn != game.profile.me.uid){
	    currentGame.reverse().forEach(function(item) { item.reverse(); } );
	}

	// Add the container for pieces (used as 'dropzones' for droppable piece)
	for (var x = 0; x <= 7; x++) {
            for (var y = 0; y <= 7; y++) {
		var square = "<div id='"+x+y+"' class='game-square dropzone'></div>";
		$("#frame").append(square);
            }
	}

	for (var x = 0; x <= 7; x++) {
            for (var y = 0; y <= 7; y++) {

		// Render a different piece depending on the array element as defined in env
		switch(currentGame[x][y]){

		case env.piece.purple: imgName = "purple_piece"; break;

		case env.piece.purpleK: imgName = "purpleking_piece"; break; 

		case env.piece.yellow: imgName = "yellow_piece"; break;

		case env.piece.yellowK:imgName = "yellowking_piece"; break;

		}

		if(currentGame[x][y] != "0"){
		    piece = $("<div id='pieceHolder' class='game-square draggable piece-holder'><img  src='img/"+imgName+".png'></div>")
		    $("#"+x+y).append(piece);
		}

            }
	}
	
	// Update player labels 
	$("#player1").text(decodeURIComponent(game.profile.me.name));
	$("#player2").text(decodeURIComponent(game.profile.yo.name));

	$(".player1-image").attr("src","img/"+game.profile.me.color+"_piece.png");
	$(".player2-image").attr("src","img/"+game.profile.yo.color+"_piece.png");

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

    var bindOnlyActive = function(move){

	var target = "" + move.to[0] + move.to[1];

	// Remove square bindings
	for (var x = 0; x <= 7; x++) {
            for (var y = 0; y <= 7; y++) {

		var xy = "" + x + y;
	
		if(xy != target){
		    $("#"+x+y+"> div").off();
		}
            }
	}
    }

    /**
     * Add jQuery click listeners to the columns.
     * Note: in the css I have added pointer-events:none
     * so click events go through overlaid UI elements
     * @method bindEvents
     */
    var bindEvents = function(game){

	    $('.draggable').draggable({
		scroll:false,
		// addClasses: false
		revert:function(event){

		    var source = $(this).attr("source");
		    $("#"+source).removeClass('game-square-highlight-spec');

		    // No droppable to bind to
		    if(event == false){
			return true;
		    }

		    var target = event[0].id;
		    // console.log('from ' + source + ' to ' + target);
		    
		    if(!currentMove){
			movesList = getPossibleMoves(game);
			console.log('mandatory moves');
			console.log(movesList);
			// If there are possible moves on the board, then the player must choose one of them.
			if(movesList.length != 0 && movesList.indexOf(target) == -1){
			    modals.showCaptureModal();
			    console.log('didnt select mandatory moves');
			    return true;
			}
		    }

		    // Illegal move snapback
		    var move = validMove(game, {
			color : game.profile.me.color,
			from: source,
			to: target,
			isKing: false,
		    });
		    
		    if(move == null){ 
			console.log('Move rejected');
			return true //do revert
		    }

		    
		    if(movesList.length > 0){
			if(movesList.indexOf(target) == -1){
			    return true;
			}
		    }


		    currentMove = move;

		    updateGameArray(game, currentMove);
		    render(game);
		    bindEvents(game);

		    if(didCapture){
			movesList = getPossibleMovesXY(game, currentMove);
			bindOnlyActive(currentMove);
		    } 

		    movesMade.push(move);

		    if(movesList.length == 0){
			makeMove(game);
		    }


		},
		start: function(event) {

		    if(game.turn != game.profile.me.uid){
			modals.showWaitingModal();
			return false;
		    }

		    var x = event.target.parentNode.id[0];
		    var y = event.target.parentNode.id[1];

		    // Discard if not my piece
		    if(currentGame[x][y] == env.piece[game.profile.yo.color])
		    { 
			return false;
		    }

		    if(currentGame[x][y] == env.piece[game.profile.yo.color+"K"])
		    { 
			return false;
		    }

		    // Store in source var as revert has no accessor
		    $(this).attr("source", event.target.parentNode.id);

		    // Highlight square
		    $("#"+event.target.parentNode.id).addClass('game-square-highlight-spec');
		},
		stop: function(event){
		    
		    // Unhighlight squares
		    $("#"+event.target.parentElement.id).removeClass('game-square-highlight');
		    $("#"+event.target.parentElement.id).removeClass('game-square-highlight-spec');

		},
		stack: ".draggable"
	    });

	$(".dropzone").droppable({
	    hoverClass: "game-square-highlight",
	    drop: function(event) {
		// console.log(event);
		// console.log(event.target.id);


	    }
	});

	var turnMade = false;
	
	$('#close-button').click(function(){
	    nativeBridge.closeView(game);
	});

	$('#give-up-button').click(function(){

	    if(game.data.move_count == 1 && game.turn != game.profile.me.uid){	    
		modals.showYesNoDialog(game, "Are you sure you want to cancel the game?", "Yes", "No");
	    }else{
		modals.showYesNoDialog(game, "Give up already?", "Yes", "Still can do it");
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

    var getPossibleMovesXY = function(game, move){

	var possibleMoves = [];

	var x = parseInt(move.to[0]);
	var y = parseInt(move.to[1]);

	$(".game-square-highlight-spec").removeClass("game-square-highlight-spec");

	try{
	    if((currentGame[x-1][y+1] == env.piece[game.profile.yo.color] ||
		currentGame[x-1][y+1] == env.piece[game.profile.yo.color+"K"])){

		if(currentGame[x-2][y+2] == 0){			  
		    possibleMoves.push(""+ (x-2)+(y+2));
		    $("#"+(x-2) + (y+2)).addClass('game-square-highlight-spec');
		}
	    }

	    if((currentGame[x-1][y-1] == env.piece[game.profile.yo.color] ||
		currentGame[x-1][y-1] == env.piece[game.profile.yo.color+"K"])){
		if(currentGame[x-2][y-2] == 0){
		    possibleMoves.push("" + (x-2)+ (y-2));
		    $("#"+(x-2) + (y-2)).addClass('game-square-highlight-spec');
		}
	    }
	}catch(e){
	}

	if(currentGame[x][y] == env.piece[game.profile.me.color+"K"]){
    	    try{

    		console.log(x, y);
    		console.log(currentGame[x][y]);

    		// Top right
    		if(currentGame[x-1][y+1] == env.piece[game.profile.yo.color] ||
    		   currentGame[x-1][y+1] == env.piece[game.profile.yo.color+"K"]){
    		    if(currentGame[x-2][y+2] == 0){
    			possibleMoves.push("" + (x-2)+ (y+2));
    			$("#"+(x-2) + (y+2)).addClass('game-square-highlight-spec');
    		    }
    		}

    		// Top left
    		if(currentGame[x-1][y-1] == env.piece[game.profile.yo.color] ||
    		   currentGame[x-1][y-1] == env.piece[game.profile.yo.color+"K"]){
    		    if(currentGame[x-2][y-2] == 0){
    			possibleMoves.push("" + (x-2)+ (y-2));
    			$("#"+(x-2) + (y-2)).addClass('game-square-highlight-spec');
    		    }
    		}

    		// Bottom right
    		if(currentGame[x+1][y+1] == env.piece[game.profile.yo.color] ||
    		   currentGame[x+1][y+1] == env.piece[game.profile.yo.color+"K"]){
    		    if(currentGame[x+2][y+2] == 0){
    			possibleMoves.push("" + (x+2)+ (y+2));
    			$("#"+(x+2) + (y+2)).addClass('game-square-highlight-spec');
    		    }
    		}

    		// Bottom left
    		if(currentGame[x+1][y-1] == env.piece[game.profile.yo.color] ||
    		   currentGame[x+1][y-1] == env.piece[game.profile.yo.color+"K"]){
    		    if(currentGame[x+2][y-2] == 0){
    			possibleMoves.push("" + (x+2)+ (y-2));
    			$("#"+(x+2) + (y-2)).addClass('game-square-highlight-spec');
    		    }
    		}
    	    }catch(e){
		
    	    }

	}
	return possibleMoves;
    }


    // 
    var getPossibleMoves = function(game){

	var possibleMoves = [];

	// Iterate through current players pieces,
	// Looking for possible moves on either side
	for (var x = 0; x <= 7; x++) {
            for (var y = 0; y <= 7; y++) {

		if(currentGame[x][y] == env.piece[game.profile.me.color]){

		    // Lazy handling..
		    try{
			if((currentGame[x-1][y+1] == env.piece[game.profile.yo.color] ||
			    currentGame[x-1][y+1] == env.piece[game.profile.yo.color+"K"])){
			    if(currentGame[x-2][y+2] == 0){			  
				possibleMoves.push(""+ (x-2)+(y+2));
				$("#"+(x-2) + (y+2)).addClass('game-square-highlight-spec');
			    }
			}

			if((currentGame[x-1][y-1] == env.piece[game.profile.yo.color] ||
			    currentGame[x-1][y-1] == env.piece[game.profile.yo.color+"K"])){
			    if(currentGame[x-2][y-2] == 0){
				possibleMoves.push("" + (x-2)+ (y-2));
				$("#"+(x-2) + (y-2)).addClass('game-square-highlight-spec');
			    }
			}
		    }catch(e){
		    }
		}		

		if(currentGame[x][y] == env.piece[game.profile.me.color+"K"]){
		    try{

			// Top right (x!=0 so we dont try to read negative array)
			if((x != 0) &&
			   (currentGame[x-1][y+1] == env.piece[game.profile.yo.color] ||
			   currentGame[x-1][y+1] == env.piece[game.profile.yo.color+"K"])){
			    if(currentGame[x-2][y+2] == 0){
				possibleMoves.push("" + (x-2)+ (y+2));
				$("#"+(x-2) + (y+2)).addClass('game-square-highlight-spec');
			    }
			}

			// Top left
			if((x != 0) &&
			   (currentGame[x-1][y-1] == env.piece[game.profile.yo.color] ||
			   currentGame[x-1][y-1] == env.piece[game.profile.yo.color+"K"])){
			    if(currentGame[x-2][y-2] == 0){
				possibleMoves.push("" + (x-2)+ (y-2));
				$("#"+(x-2) + (y-2)).addClass('game-square-highlight-spec');
			    }
			}

			// Bottom right
			if((x != 7) &&
			   (currentGame[x+1][y+1] == env.piece[game.profile.yo.color] ||
			   currentGame[x+1][y+1] == env.piece[game.profile.yo.color+"K"])){
			    if(currentGame[x+2][y+2] == 0){
				possibleMoves.push("" + (x+2)+ (y+2));
				$("#"+(x+2) + (y+2)).addClass('game-square-highlight-spec');
			    }
			}

			// Bottom left
			if((x != 7) && 
			   (currentGame[x+1][y-1] == env.piece[game.profile.yo.color] ||
			   currentGame[x+1][y-1] == env.piece[game.profile.yo.color+"K"])){
			    if(currentGame[x+2][y-2] == 0){
				possibleMoves.push("" + (x+2)+ (y-2));
				$("#"+(x+2) + (y-2)).addClass('game-square-highlight-spec');
			    }
			}
		    }catch(e){
			// console.log(e);
		    }
		}
	    }
	}
	return possibleMoves;
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

	var enemyPieceCount = 0;	
	for (var x = 0; x <= 7; x++) {
            for (var y = 0; y <= 7; y++) {
		// Count opponents pieces, if none remain the game is over.
		
		if(currentGame[x][y] == env.piece[game.profile.yo.color]){
		    enemyPieceCount++;
		}

		if(currentGame[x][y] == env.piece[game.profile.yo.color+"K"]){
		    enemyPieceCount++;
		}

	    }
	}

	(enemyPieceCount == 0) ? gameOverStatus = true : console.log(enemyPieceCount + ' enemy pieces remain');

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

	template = template.split('{{gamename}}').join(game.game);	
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
	console.log('Replay move! (not impl yet)');

	console.log('remove last move');
	console.log(game);	
	
	setTimeout(function(){
	    modals.showReplayModal(game);
	},700);
	
	setTimeout(function(){

	    console.log(game.data.last_move_source);
	    console.log(game.data.last_move_target);
	    
	    // Update game state
	    // updateGameArray(column, game.profile.yo.color);
	}, 2400);
    }

    /**
     * Removes the last moves token from the incoming data
     * allowing us to replay it on the receivers end.
     * @param {Integer} column
     * @method removeLastMove
     */
    var removeLastMove = function(game){


	
	// // Store whether it was red or yellow token.
	// var lastMoveColor = currentGame[6-getColumnHeight(column)][column];

	// // Remove topmost token from last column
	// currentGame[6-getColumnHeight(column)][column] = 0;

	// return lastMoveColor;
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

	// if(game.profile.me.uid == "U002"){
	//     // invert game board for player 2	    
	//     game.data.game_board = game.data.game_board.split("1").join("*").split("2").join("1").split("*").join("2");
	// }

	// Do validation (need elaborate)
	// if(game.data.game_board.length != 64){
	//     game.data.game_board = "0000000000000000000000000000000000000000000000000000000000000000";
	// }

	// Split into rows
	splitArray = game.data.game_board.match(/.{1,8}/g);

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
     * @method 
     */
    var initializeGameData = function(game){
	game.data.game_board = "2020202002020202202020200000000000000000010101011010101001010101"; // standard
	// game.data.game_board = "0000000000000000000000000200000010000000000020000000000000000000"; // win
	// game.data.game_board = "2020202002020202202020200000000000000000010101021010101001010001"; // enemy king
	// game.data.game_board = "0000000000000000003030030304001000101000000000000000000000000000"; //king test
	// game.data.game_board = "2020000000000000000020220000010000200000010101011010101001010101"; //nth jump test
	// game.data.game_board = "2020000000000000000020220000010000200000030101011010101001010101"; //nth jump test
	// game.data.game_board = "2020202002020202202020200000000000000000010001021010101000010001"; // enemy king nth
	// game.data.game_board = "20302020020202000000202002000000000000000010001021010101000010001"; // my king nth
    	game.data.move_count = 0;
    	game.turn = game.profile.me.uid;
    	game.profile.me.color = "purple";
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
