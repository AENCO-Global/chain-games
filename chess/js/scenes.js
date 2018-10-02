/**
 * 
 * @class scenes
 */
var scenes = (function(){

    /**
     * Depending on the state of env.data, executes a different method
     * for each state the user could be in.
     * @method show
     */
    var show = function(){

	// Need to check for quit message first. this is because wrapper is using TURN field
	// to display correct 'GIVE UP' message.
	if(env.data.type == 'quit'){

	    if(env.data.data.winner == env.data.profile.me.uid){
		functions.triggerGameOver('win');
	    }else {
		functions.triggerGameOver('loss');
	    }

	}else if(env.data.type == 'end'){

	    // Show opponents last move
	    setTimeout(function(){
		functions.showLastMove();
		// functions.checkGameover();		    
	    }, 700);
	    
	    functions.render();
	    // functions.bindEvents();

	    setTimeout(function(){
		if(env.data.data.winner == env.data.profile.me.uid){
		    functions.triggerGameOver('win');
		}else {
		    functions.triggerGameOver('loss');
		}
	    }, 2500);


	}
	else{
	    if (env.data.turn == env.data.profile.me.uid) {
	 	
		if (env.data.type == 'start') {
		    functions.render();
		    functions.bindEvents();
		}

		if(env.data.type == 'move'){
		    
		    setTimeout(function(){
			modals.showReplayModal();
		    },700);

		    // Show opponents last move
		    setTimeout(function(){
			functions.showLastMove();
			functions.checkGameover();
		    }, 2500);

		    functions.render();

		    // Show make move message after opponents last move
		    // has been replayed.
		    setTimeout(function(){
			modals.showYourTurnModal();
			functions.bindEvents();
		    }, 3500);
		}
		

	    }else{
		setTimeout(function(){
		    functions.showLastMove();
		}, 700);
		
		functions.render();
		functions.bindEvents();

	    }
	}

    }

    /**
     * Handler for inviting somebody
     * @method inviteOpponent
     */
    var inviteOpponent = function() {

	// Popup invite modal
	// modals.showSendInviteModal();
    }


    /**
     * When you receive and invite for the first time from other user.
     * Choose to play or Reject.
     * @method invited
     */
    var invited = function() {
	
	// Popup receive invite modal
	modals.showGetInviteModal();
    }

    /**
     * When a message comes in for your move, then popup this dialog for a short time, then do the move.
     * @method yourMove
     */
    var yourMove = function(typeOfMove) {

	// Popup make move modal
	modals.showMakeMoveModal(typeOfMove);
    }


    /**
     * When a message comes in for your move, then popup this dialog for a short time, then do the move.
     * When a Move is sent pop this up till window closed;
     * @method moveSent
     */
    var moveSent = function(){
	modals.showMoveSentModal();
    }

    var attackSent = function(){ // Send attack move, this will set the state and type, plus lag dialogue
	env.data.type = "move"; // Attacks will always have previous as move, As the first attack will have previous invite
	env.data.state = "move";  // this is past, and future is all moves, until end or quit, but this will not come here.
	hook.sendMove();
	moveSent();
    }

    // When ever its not your turn, then waiting will popup.
    var waitingOpponent = function() {
	// modals.showWaitingModal();
    }

    var shipMenuDialog = function(param){
	console.log(param);
	if (param == 'send') {
	    env.data.type = "move";
	    env.data.state = "invite";
	    hook.sendMove();
	    moveSent();
	    hook.closeView('shipMenuDialog');
	} else if (param == 'reset') {
	    functions.reset();
	} else {  //quit
	    env.data.turn = env.data.profile.yo.uid ;
	    env.data.type = "quit";
	    hook.sendMove();
	    moveSent();
	    youLose();
	}
    }

    // below not yet modalled.
    var reject = function() {
	rejectModal.show();
	setTimeout(function() {
	    hook.closeView('Reject');
	}, 1000);
    }

    var youWin = function() {
	modals.showYouWinModal();
    }

    var youLose = function() {
	loseModal.show();
    }

    var hideShipBoard = function(){
	$(".shipForm").css({ "display": "none"}); // Hide the Ship Form
	$(".buttonForm").css({ "display": "block"}); // show the button Form
    }

    var showShipBoard = function(){
	$(".shipForm").css({ "display": "block"}); // Hide the Ship Form
	$(".buttonForm").css({ "display": "none"}); // show the button Form
    }

    return{
	inviteOpponent : inviteOpponent,
	invited : invited,
	hideShipBoard: hideShipBoard,
	showShipBoard: showShipBoard,
	yourMove: yourMove,
	shipMenuDialog: shipMenuDialog,
	reject : reject,
	waitingOpponent : waitingOpponent,
	youWin : youWin,
	youLose : youLose,
	attackSent : attackSent,
	show : show
    }
    
})();


