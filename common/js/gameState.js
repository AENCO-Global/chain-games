/**
 * Module handles the state of the game depending on game JSON
 * Currently depends on hook.js onReceiveMessage
 * @class gameState
 */
var gameState = (function(){

    /**
     * @method process
     */
    var process = function(game){

	var myTurn = (game.turn == game.profile.me.uid  ? true:false);
	var myWin = (game.data.winner == game.profile.me.uid  ? true:false);

	switch(game.type){

	case 'quit':
	    functions.loadGame(game);
	    (myWin) ? functions.triggerGameOver(game, 'win') : functions.triggerGameOver(game, 'loss');
	    break;

	case 'cancel':
	    functions.loadGame(game);
	    (myWin) ? functions.triggerGameOver(game, 'win') : functions.triggerGameOver(game, 'loss');
	    break;

	case 'end':
	    functions.loadGame(game);
	    functions.replayLastMove(game);
	    functions.render(game);

	    setTimeout(function(){
		(myWin) ? functions.triggerGameOver(game, 'win') : functions.triggerGameOver(game, 'loss');
	    }, 2000);
	    break;

	case 'start':
	    functions.initializeGameData(game);
	    functions.loadGame(game);
	    functions.render(game);
	    functions.bindEvents(game);
	    break;

	case 'move':
	    // remove last move?
	    functions.loadGame(game);
	    if(myTurn){
		functions.replayLastMove(game);
		functions.render(game);

		setTimeout(function(){
		    modals.showYourTurnModal();
		    functions.bindEvents(game);
		}, 3500);
		break;
	    }else{

		functions.render(game);
		functions.bindEvents(game);
	    }
	}
    }

    return{
	process : process
    }
    
})();

