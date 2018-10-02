/**
 * Description
 * @class scenes
 */
var scenes = (function(){
    /**
     * Depending on the state of env.data, executes a different method
     * for each state the user could be in.
     * @method show
     */
    var show = function(){

		if (env.data.turn == env.data.profile.me.uid || env.data.type == 'start' ) {
			switchScene(''); // reset to default screen, myboard.
			// $('#background')[0].play(); // play background sound
			if ('conflict' == env.data.type) {
				modals.conflictWarning('me');
			} else if (env.data.type == 'start'  || env.data.type.length < 1) {
				// invite phase cancelled -> inviteOpponent();
				// Same as invited phase, we skip the invite mode, and go straight to set up ships. and Start.
				// functions.randomizeShipLocations(); 

				switchScoreBoard(2);
				invited();				
		  //   } else if (env.data.type == 'invite') {
		  //   	// functions.randomizeShipLocations(); 
				// switchScoreBoard(2);
				// invited();
				// console.log("2...",env.data);
		    } else if (env.data.type == 'move') {
				if (env.data.state == 'invite') { // Time to make a move
					switchScoreBoard(2);
				    // yourMove('setup');
				} else {  // There can only be a move, the only way to transistion to a move is from an invite..
					// hideShipBoard();
					switchScoreBoard(0);
				    yourMove('incomingAttack');
				}
		    } else if (env.data.type == 'end' ) { // The winner will send a lose message
				youLose();
		    } else if (env.data.type == 'quit' ) { // The Quitter will send a Win Message
				hook.clearData();
				if (env.data.state == 'invite') {
				    modals.reject();
				} else {  // win if the other guys fucks off.
					youWin();
				}
		    }  else {
				console.log("Nothing Receive",env.data);
			// rejected();
		    }
		} else { // not my Turn so display waiting with options to quit.
			if ('conflict' == env.data.type) {
				modals.conflictWarning('yo');
			}
		    waitingOpponent();
		}
 	}

    /**
     * Handler for inviting somebody
     * @method inviteOpponent
     */
    var inviteOpponent = function() {
    	showShipBoard();
    	$("#invite").css("display","inline-block");
		$("#invite").unbind('click').click(function(){
	    	$("#invite").css("visibility","hidden");
			setTimeout(function() {
			    env.data.type = "invite" ; //set the other players turn
			    env.data.state = "invite" ; //set the other players turn
			    hook.sendMove(env.data);
			    modals.showInvitationSentModal();
			    hook.closeView('InviteOpponent-Invite');
			}, 500);
	    });
    }


    /**
     * When you receive and invite for the first time from other user.
     * Choose to play or Reject.
     * @method invited
     */
    var invited = function() {
		// Popup receive invite modal
		modals.showGetInviteModal();
		// scenes.yourMove('setup');
    }

    // Start my Attack move and set the screen.
    var myAttack = function(){
    	switchScene('attack');
        sonar();
    	modals.showMyTurnModal();
    }

    var sonar = function(){
        // Add radar animation
        $('#sonar').clone()[0].play(); // play Sonar sound
        $("#theirboard").append($("<div id='animatedRadar' class='radar'><img src='../img/radar_pointer.png' class='spinRadar' alt=''/></div>"));
        setTimeout(function(){
            $('#animatedRadar').remove();
        }, 3000);
    }
    /**
     * When a message comes in for your move, then popup this dialog for a short time, then do the move.
     * @method yourMove
     */
    var yourMove = function(typeOfMove) {
    	if ('setup' == typeOfMove) {
	    	$("#invite").css("display","none");
    	}

    	// Set ships to drag
		$('#ship-1 img').addClass('drag');
    	$('#ship-2 img').addClass('drag');
    	$('#ship-3 img').addClass('drag');
    	$('#ship-4 img').addClass('drag');

		// switchScene('defend');
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

    var attackSend = function(){ // Send attack move, this will set the state and type, plus lag dialogue
		env.data.type = "move"; // Attacks will always have previous as move, As the first attack will have previous invite
		env.data.state = "move";  // this is past, and future is all moves, until end or quit, but this will not come here.
		hook.sendMove();
		moveSent();
    }

    // When ever its not your turn, then waiting will popup.
    var waitingOpponent = function() {
    	hideShipBoard();
		switchScoreBoard(4);
		functions.initOwnBoard('');
//		$('#myboard div div').removeClass('ui-draggable-handle');
//		$('#myboard div div').removeClass('ui-draggable');
//		$('#myboard div div img').attr('draggable',"false");
    }

    var shipMenuDialog = function(param){
		console.log(param);
		if ('send' == param) {
		    env.data.type = "move";
		    env.data.state = "invite";
		    hook.sendMove();
		    moveSent();
		    hook.closeView('shipMenuDialog');
		} else if ('attack' == param) {
		    env.data.type = "move";
		    env.data.state = "move";
		    hook.sendMove();
		    moveSent();
		    hook.closeView('shipMenuDialog');
		} else if (param == 'start') {

			if (env.data.type == "move" && env.data.state == "invite") {
				switchScene('attack');
				sonar();
				modals.showMyTurnModal();
			} else {
				env.data.type = "move";
			    env.data.state = "invite";			    
			    hook.sendMove();
			    moveSent();
			}
			// switchScene('attack');
			// sonar();
			// modals.showMyTurnModal();
		} else if ('reset' == param) {
			resetScene();
		} else if ('quit' == param) {  //quit
	    	console.log('Quit from shipMenuDialog')
	    	modals.showQuitingModal();
		} else {
			console.log("Should never get here",param);
		}
    }

    // below not yet modalled.
    var switchScene = function(param){
    	console.log("Switching Scenes",param);
		if ('attack' == param) {
			$("#myboard").css({ "display": "none"}); // Hide 
			$("#theirboard").css({ "display": "block"}); // show 
			$("#winboard").css({ "display": "none"}); // show 
		} else if ('win' == param){
			$("#myboard").css({ "display": "none"}); // Hide 
			$("#theirboard").css({ "display": "none"}); // show 
			$("#winboard").css({ "display": "block"}); // show 
		} else  {
			$("#myboard").css({ "display": "block"}); // show
			$("#theirboard").css({ "display": "none"}); // Hide
			$("#winboard").css({ "display": "none"}); // show 
		}
    }

    var resetScene = function(){
    	// set the dragable to on.

	    functions.reset();
		switchScoreBoard(2);

    }

    var youWin = function() {
    	switchScene('win');
    	triggerGameOver();
    }

    var youLose = function() {
	    if ("quit" == env.data.type) {
	    	console.log("Quit by the player");
	    } else {
	    	console.log("Quit by losing");
	    	env.data.type = 'end';
	    };

	    hook.sendMove();
		modals.showYouLoseModal();
		hook.closeView('waitPopup-Close');
    }

  //   var hideShipBoard = function(){
		// $(".shipForm").css({ "display": "none"}); // Hide the Ship Form
		// $(".buttonForm").css({ "display": "block"}); // show the button Form
  //   }

  //   var showShipBoard = function(){
		// $(".shipForm").css({ "display": "block"}); // Hide the Ship Form
		// $(".buttonForm").css({ "display": "none"}); // show the button Form
  //   }

    var switchScoreBoard = function(param){ // load of button handling here.?
    	var choices = { 
    		0 : 	'<h1>You are under attack</h1><p>Prepare to counter</p> \
    				 <a class="ghost" id="quitMe" onclick="scenes.shipMenuDialog(\'quit\')"> Quit </a> \
    				 <a class="ghost" id="closeMe" onclick="hook.closeView(\'switchScoreBoard\')"> Close </a>',
    		1 : 	'<a class="ghost" id="startMe" onclick="scenes.shipMenuDialog(\'send\')"> Start </a> \
		        	 <a class="ghost" id="resetMe" onclick="scenes.shipMenuDialog(\'reset\')"> Reset </a> \
       				 <a class="ghost" id="quitMe" onclick="scenes.shipMenuDialog(\'quit\')"> Quit </a> \
    				 <a class="ghost" id="closeMe" onclick="hook.closeView(\'switchScoreBoard\')"> Close </a>' ,
		    2 : 	'<a class="ghost" id="startMe" onclick="scenes.shipMenuDialog(\'start\')"> Start </a> \
		        	 <a class="ghost" id="resetMeLeft" onclick="scenes.shipMenuDialog(\'reset\')"> Reset </a> \
       				 <a class="ghost" id="quitMeRight" onclick="scenes.shipMenuDialog(\'quit\')"> Quit </a> \
    				 <a class="ghost" id="closeMe"  onclick="hook.closeView(\'switchScoreBoard\')"> Close </a>' ,
		    3 : 	'<h1>Make your move</h1><p>Select a square to Attack.</p> \
       				 <a class="ghost" id="resignMe" onclick="scenes.shipMenuDialog(\'quit\')"> Resign </a> \
    				 <a id="closeMe" class="ghost" onclick="hook.closeView(\'switchScoreBoard\')"> Close </a>', 
		    4 : 	'<h1>Waiting for your Opponent</h1><p>If you <b>Resign</b> You will lose the game.</p> \
		    		 <a class="ghost" id="resendMe" onclick="scenes.shipMenuDialog(\'send\')"> Resend Last Move </a> \
       				 <a class="ghost" id="waitNoMoreMe" onclick="scenes.shipMenuDialog(\'quit\')"> Resign </a> \
    				 <a class="ghost" id="closeMe" onclick="hook.closeView(\'switchScoreBoard\')"> Close </a>' 
					};

    	$("#myChoices").html(choices[param]);
    }

    /**
     * Changes the game to the game over state by
     * showing victory screen.
     * @method triggerGameOver
     */
    var triggerGameOver = function(){
		var template =
			'<div id="gameover">\
	      		<div id="top-message">\
					<h3 id="gamename">{{gamename}}</h3>\
					 <h2 id="gamecondition">{{gamestate}}</h2>\
	      		</div>\
	      		<div id="profile-holder">\
					<div id="profile">\
		  				<img src="{{player1-picture}}">\
		  				<div>{{player1-name}}</div>\
					</div>\
					<div id="V">\
		  				<h3>VS</h3>\
					</div>\
					<div id="profile">\
		  				<img src="{{player2-picture}}">\
		  				<div>{{player2-name}}</div>\
					</div>\
					<div id="score">\
		  				Score<br/><br/>\
		  				{{player1-name}} {{player1-score}} - {{player2-name}} {{player2-score}}\
					</div>\
	      		</div>\
	     		<div id="share-button">\
					Share your awesomeness on FACEBOOK!\
	      		</div>\
	      		<div id="gameover-close">\
					<div class="options-button">Close</div>\
	      		</div>\
			</div>';

		// This split / join replaces all occurrences, not just first
		// as replace does.
		template = template.split('{{gamename}}').join('Battle Fleets');
		template = template.split('{{gamename}}').join(env.data.game);
		template = template.split('{{gamestate}}').join('You won !!');
		template = template.split('{{player1-picture}}').join(env.data.profile.me.img);
		template = template.split('{{player2-picture}}').join(env.data.profile.yo.img);
		template = template.split('{{player1-name}}').join(env.data.profile.me.name);
		template = template.split('{{player2-name}}').join(env.data.profile.yo.name);
		template = template.split('{{player1-score}}').join(env.data.profile.me.score);
		template = template.split('{{player2-score}}').join(env.data.profile.yo.score);

		$("body").html("");
		$("body").append(template);

		$("#gameover-close").click(function(){
		    hook.clearData();
		    hook.closeView();
		});

		$("#share-button").click(function(){
			imageMerge.resultImg(
							env.data.profile.me.img,
			    			env.data.profile.me.name,
			    			env.data.profile.me.score,
			    			env.data.profile.yo.img,
			    			env.data.profile.yo.name,
			    			env.data.profile.yo.score,
			    			'./img/winbg.jpg',
			    			1,
						    function(myImg){ //For local image display only.
						    },
						    function(mimeObj){ // Mime encoded version, needs to be done in the app
							  var b64 = mimeObj.substring(mimeObj.indexOf(',')+1, mimeObj.length);
							  hook.shareFacebookImage(b64);
						    }
	    	);
		});
	};	

    var dragAndDrop = function(){
		var imgoffset = 0; 
		$('.rTableCell').on('touchstart',function(event){
			$('<div id="drag-container" class="shipdrag"><img id="dragimg" src=""></div>').appendTo('#myboard');

			if ($(this).is('.ship1-single')) {
				$('#dragimg').attr("src","../img/ship1.png");
				$('#dragimg').css("width","14vw");
				$('#dragimg').css("height","6vh");
				imgoffset = 14*(100 / document.documentElement.clientWidth);
			}
			if ($(this).is('.ship2-left, .ship2-right')) { 
				$('#dragimg').attr("src","../img/ship2.png");
				$('#dragimg').css("width","26vw");
				$('#dragimg').css("height","8vh");
				imgoffset = 26*(100 / document.documentElement.clientWidth);
			}
			if ($(this).is('.ship3-left, .ship3-mid, .ship3-right')) { 
				$('#dragimg').attr("src","../img/ship3.png");
				$('#dragimg').css("width","38vw");
				$('#dragimg').css("height","10vh");
				imgoffset = 38*(100 / document.documentElement.clientWidth);
			}
			if ($(this).is('.ship4-left, .ship4-left-mid, .ship4-right-mid, .ship4-right')) { 
				$('#dragimg').attr("src","../img/ship4.png");
				$('#dragimg').css("width","54vw");
				$('#dragimg').css("height","10vh");
				imgoffset = 54*(100 / document.documentElement.clientWidth);
			}

		});
		$('.rTableCell').on('touchmove',function(event){
			event.preventDefault();
			var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
			$('#drag-container').css("left",touch.pageX-(imgoffset*7));
			$('#drag-container').css("top",touch.pageY-30);
		});

		$('.rTableCell').on('touchend',function(event){
			$('#drag-container').remove();

		});
    }

    return{
    dragAndDrop : dragAndDrop,
	inviteOpponent : inviteOpponent,
	invited : invited,
	// hideShipBoard: hideShipBoard,
	// showShipBoard: showShipBoard,
	switchScoreBoard : switchScoreBoard,
	switchScene : switchScene,
	yourMove: yourMove,
	myAttack : myAttack,
	shipMenuDialog: shipMenuDialog,
	waitingOpponent : waitingOpponent,
	youLose : youLose,
	youWin : youWin,
	attackSend : attackSend,
	triggerGameOver:triggerGameOver,
	sonar : sonar,
	show : show,
    }
    
})();

//scenes.dragAndDrop();

