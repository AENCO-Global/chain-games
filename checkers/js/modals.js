/**
 * Lovely library for Chaatz games modal popups.
 * Uses picomodal under the hood
 * @class modals
 */
var modals = (function(){

    /**
     * Templates for modal popups.
     * @attribute tpl
     * @readOnly
     */
    var tpl = {
	startGame :  '<div class="modals" id="inviteModal" ><h1>Four in a row</h1> \
              <hr /><h2></h2>\
              <p>\
                <button class="delayed blue" id="invite" >Start</button> \
                <button class="delayed blue" id="cancel" >Quit</button>\
</p></div>',
	giveUp :  '<div class="modals" id="giveUpModal" ><h1>Give up already?</h1> \
              <hr />\
              <div class="modal-button" id="continue">Still can do it</div> \
              <div class="modal-button" id="yes" >Yes</div>',
	invite :  '<div class="modals" id="inviteModal" ><h1>Battle Fleets</h1> \
              <hr /><h2>Invite to Play</h2><hr />\
              <p>\
                <button class="delayed blue" id="invite" >Invite</button> \
                <button class="delayed blue" id="cancel" >Cancel</button>\
              </p></div>',
	invited :  '<div class="modals" id="inviteModal" ><h1>Battle Fleets</h1> \
              <hr /><h2>Invitation to Play</h2><hr />\
              <p>\
                <button class="delayed green" id="play" >Play</button> \
                <button class="delayed red" id="quit" >Quit</button>\
              </p></div>',
	waiting : '<div class="modals moveSentBox" id="waitModal"><h1>Not your turn yet</h1>\
              <p></p></div>\
                ',
	sent    : '<div class="modals" id="sentModal"> <h1>Invitation Sent</h1>\
              <p>Invitation has been sent!</p> </div>',
	win     : '<div class="modals" id="winModal"><h1>Winner</h1>\
<p>Congratulations you beat your opponent.<br></p></div>',
	win_by_friend_quit : '<div class="modals" id="winModal"><h1>Winner</h1>\
<p>Your friend has left the game.<br></p></div>',
	lose    : '<div class="modals" id="loseModal"><h1>Loser</h1>\
              <p>Commiserations your opponent won this round.<br></p></div>',
	move    : '<div class="modals" id="moveModal"> <h1>Its your turn!</h1>\
<p>Make your move!</p> </div>',
	yourturn    : '<div class="modals" id="yourturnModal">Your turn!</div>',
	reject  : '<div class="modals" id="moveModal"> <h1>Rejected</h1>\
              <p>Your request was Rejected</p> </div>',
	moveSent : '<div class="modals moveSentBox" id="yourturnModal"><h1>Move sent!</h1>\
<p></p>\ </div>',
	notice : '<div class="modals" id="attackMove"> <h1>Notice</h1>\
<p><br /><!--message--> <br />&nbsp </p> </div>',
	loading : '<div class="modals">\
<img src="img/ajax-loader.gif"> </div>',

    };

    /**
     * Description
     * @method showReplayModal
     */
    var showReplayModal = function(game){
	killModal();

	var replay = "<div class='modals'>\
<div class='replayModalBox'><h2>Showing</h2><h1>{{line1}}'s Move</h1></div>\
<img class='replayModalImg' src='{{gameimg}}'>\
</div>"

	if(game.profile.yo.img == ""){
	    replay = replay.split('{{gameimg}}').join("img/user.jpg");
	}else{
	    replay = replay.split('{{gameimg}}').join(game.profile.yo.img);
	}	
	replay = replay.split('{{line1}}').join(decodeURIComponent(game.profile.yo.name));
	
	masterModal = picoModal({content: replay, width:'95%' ,  closeButton:false, overlayClose:false, overlayStyles: function ( styles ) { styles.opacity = 0.5; }, modalStyles: function ( styles ) { styles.visibility = "hidden", styles.padding="15px", styles.opacity="0"}} ).afterShow(function(modal){

	    $(modal.overlayElem()).on('click',function(){
		killModal();
	    });
	    
	    $(modal.modalElem()).animate({opacity:"1.0"},300);
	    
	    setTimeout(function(){
	    	$(modal.modalElem()).animate({opacity:"0"},300);
	    }, 1500);
	    
	    setTimeout(function(){
	    	killModal();
	    }, 1800);
	}).show();	
    }

    /**
     * Description
     * @method showSendInviteModal
     */
    var showSendInviteModal = function(){
	killModal();
	masterModal = picoModal({content: tpl.invite, width:'70%' ,  closeButton:false, overlayClose:false} ).afterShow(function(){
	    $("#invite").unbind('click').click(function(){

		setTimeout(function() {
		    env.data.type = "invite" ; //set the other players turn
		    env.data.state = "start" ; //set the other players turn
		    hook.sendMove(env.data);
		    // inviteSent();

		    killModal();
		    masterModal = picoModal({content: tpl.sent, width:'70%' ,  closeButton:false, overlayClose:false } ).show();

		    hook.closeView('InviteOpponent-Invite');

		}, 500);
	    });
	    $("#cancel").on('click', function() { 
	    	hook.closeView('InviteOpponent-Cancel');
	    });
	}).show();
    }

    // 
    var showGetInviteModal = function(){
    	killModal();
		masterModal = picoModal({content: tpl.invited, width:'70%' ,  closeButton:false, overlayClose:false } ).afterShow(function(){
		    $("#play").on('click', function(){ // Start my setup
				console.log("I Want to play");
		    	scenes.yourMove('setup');
		    });
		    $("#quit").on('click', function() {  // Send quit message
				console.log("I Dont Want to play");
				env.data.turn = env.data.profile.yo.uid ;
				env.data.status = env.data.type ; // Should say invite.
				env.data.type = "quit";
				env.data.state = "invite";	    
				hook.sendMove();
		    });
		}).show();
    }

    // 
    var showMakeMoveModal = function(typeOfMove){
	killModal();
	masterModal = picoModal({content: tpl.move, width:'70%' ,  closeButton:false, overlayClose:false });
    	masterModal.show();
		setTimeout(function() {
		    killModal();
		}, 1000, typeOfMove);
    };

    var showYourTurnModal = function(typeOfMove){

	var replay = "<div class='modals'>\
<div class='replayModalBox'><h2></h2><h1>Your Turn</h1></div>\
<img class='replayModalImg' src='{{gameimg}}'>\
</div>"

	if(env.data.profile.me.img != ""){
	    replay = replay.split('{{gameimg}}').join(env.data.profile.me.img);	    
	}else{
	    replay = replay.split('{{gameimg}}').join("img/user.jpg");
	}

	masterModal = picoModal({content: replay, width:'95%' ,  closeButton:false, overlayClose:false,  modalStyles: function ( styles ) { styles.visibility = "hidden", styles.padding="15px", styles.opacity="0"}} ).afterShow(function(modal){

	    $(modal.overlayElem()).on('click',function(){
		killModal();
	    });

	    $(modal.overlayElem()).animate({opacity: .5});
	    $(modal.modalElem()).animate({opacity:"1.0"},300);
	    
	    setTimeout(function(){
	    	$(modal.modalElem()).animate({opacity:"0"},300);
	    }, 1500);

	    setTimeout(function(){
	    	killModal();
	    }, 1800);
	    
	}).show();	
	
    };

    //
    var showMoveSentModal = function(){
	killModal();

	masterModal = picoModal({content: tpl.moveSent, width:'95%' ,  closeButton:false, overlayClose:false,  modalStyles: function ( styles ) { styles.visibility = "hidden", styles.padding="15px", styles.opacity="0"}} ).afterShow(function(modal){

	    $(modal.overlayElem()).animate({opacity: .5});
	    $(modal.modalElem()).animate({opacity:"1.0"},300);
	    
	    // setTimeout(function(){
	    // 	$(modal.modalElem()).animate({opacity:"0"},300);
	    // }, 1500);
	    
	    // setTimeout(function(){
	    // 	killModal();
	    // }, 1800);
	    
	}).show();	
    };
    
    var showWaitingModal = function(){

	killModal();

	masterModal = picoModal({content: tpl.waiting, width:'95%' ,  closeButton:false, overlayClose:false, overlayStyles: function ( styles ) { styles.opacity = 0; }, modalStyles: function ( styles ) { styles.visibility = "hidden", styles.padding="15px", styles.opacity="0"}} ).afterShow(function(modal){

	    // $(modal.overlayElem()).animate({opacity: .5});
	    $(modal.overlayElem()).on('click',function(){
		killModal();
	    });
	    
	    $(modal.modalElem()).animate({opacity:"1.0"},300);
	    
	    setTimeout(function(){
	    	$(modal.modalElem()).animate({opacity:"0"},300);
	    }, 1500);
	    
	    setTimeout(function(){
	    	killModal();
	    }, 1800);
	    
	}).show();	
    }

    // 
    var showRejectModal = function(){
	killModal();
	masterModal = picoModal({content:tpl.reject,   width:'70%' ,  closeButton:false, overlayClose:false,   focusOn:"#pico_title" });	
    }

    //
    var showYouWinModal = function(){
	killModal();
	masterModal = picoModal({content: tpl.win, width:'70%' ,  closeButton:false, overlayClose:false } ).show();
	
    }

    // Friend left case
    var showYouWinFriendQuitModal = function(){
	killModal();
	masterModal = picoModal({content: tpl.win_by_friend_quit, width:'70%' ,  closeButton:false, overlayClose:false } ).show();
	
    }   

    //
    var showYouLoseModal = function(){
	killModal();
	masterModal = picoModal({content: tpl.lose, width:'70%' ,  closeButton:false, overlayClose:false } ).show();
    }

    /**
     * Shown on game start! Two options: Play and Quit.
     * @method showStartGameModal
     */
    var showStartGameModal = function(){
	killModal();
	masterModal = picoModal({content: tpl.startGame, width:'70%' ,  closeButton:false, overlayClose:false} ).afterShow(function(){
	    $("#invite").on('click', function(){
		
		setTimeout(function() {
		    showMakeMoveModal();
		    // killModal();
		}, 500);

		//     env.data.type = "invite" ; //set the other players turn
		//     env.data.state = "start" ; //set the other players turn
		//     hook.sendMove(env.data);
		//     // inviteSent();
		//     killModal();
		//     masterModal = picoModal({content: tpl.sent, width:'70%' ,  closeButton:false, overlayClose:false } ).show();
		//     hook.closeView('InviteOpponent-Invite');

	    });
	    $("#cancel").on('click', function() {
	    	hook.closeView('InviteOpponent-Cancel');
	    });
	}).show();
    }

    // 
    var killModal = function(){
    	try { // we are not interested if this fails, due to the fact that, if somone has a window open with no modals, then an error will happen.
	    masterModal.destroy();
	}
	catch(err) {
	    // console.log('Expected catch',err);
	}
    }

    var showNotice = function(param){
	var msg = tpl.notice.replace("<!--message-->", param ) ;
	noticeModal = picoModal({content: msg, width:'80%' ,  closeButton:true, overlayClose:false, modalClass:'warning' });
    	noticeModal.show();
    };

    var showYesNoDialog = function(title, yesString, noString, callback){
	killModal();

	var html = '<div class="modals" id="giveUpModal">\
<h1>{{title}}</h1> \
<div id="relative">\
<hr>\
<div class="modal-button" id="continue">{{noString}}</div>\
<div class="vertical-divide"></div>\
<div class="modal-button" id="yes" >{{yesString}}</div>\
</div>\
</div>';

	html = html.split('{{title}}').join(title);
	html = html.split('{{noString}}').join(noString);
	html = html.split('{{yesString}}').join(yesString);

	masterModal = picoModal({content: html, width:'95%' ,  closeButton:false, overlayClose:false,  modalStyles: function ( styles ) {styles.padding="15px", styles.visibility="hidden", styles.opacity="0"}} ).afterShow(function(modal){

	    $(modal.overlayElem()).animate({opacity: .5});
	    $(modal.modalElem()).animate({opacity:"1.0"},300);
	    
	    $("#continue").unbind('click').click(function(){
		    killModal();
	    });
	    
	    $("#yes").on('click', function() {

		if(env.data.data.move_count == 1 && env.data.turn != env.data.profile.me.uid){
		    env.data.type = "cancel";
		    env.data.notification = "I cancelled the game.";
		    env.data.start_notification = "";
		}else{
		    env.data.type = "quit";
		    env.data.notification = "I gave up the game.";
		    env.data.start_notification = "";
		}
	
		env.data.state = "move";		
		env.data.turn = env.data.profile.me.uid;		
		env.data.data.winner = env.data.profile.yo.uid;
		
		hook.sendMove(env.data);

		killModal();
		hook.closeView();
		
	    });
	    	    
	}).show();	
	
    }

    var showGiveUpModal = function(){
	
	killModal();
	masterModal = picoModal({content: tpl.giveUp, width:'95%' ,  closeButton:false, overlayClose:false, modalStyles: function ( styles ) { styles.visibility = "hidden", styles.padding="15px", styles.opacity="0"}} ).afterShow(function(){
	    
	    $("#continue").unbind('click').click(function(){
		killModal();
	    });
	    $("#yes").on('click', function() {

		if(env.data.type == 'move' && env.data.state == 'start' && env.data.turn != env.data.profile.me.uid){
		    env.data.type = "cancel";		  		    
		}else{
		    env.data.type = "quit";
		}
		
		env.data.state = "move";
		env.data.turn = env.data.profile.me.uid;		
		env.data.data.winner = env.data.profile.yo.uid;
		
		hook.sendMove(env.data);
		killModal();
		hook.closeView();		
	    });
	}).show();
	
    };

    var showLoadingModal = function(){
	killModal();
	
	masterModal = picoModal({content: tpl.loading, width:'70%' ,  closeButton:false, overlayClose:false });
    	masterModal.show();
	
	setTimeout(function() {
	    killModal();
	    // alert("Could not share score. Please try again later.");
	}, 8000);
    };

    return{
	showStartGameModal : showStartGameModal,
	showGiveUpModal : showGiveUpModal,
	showSendInviteModal : showSendInviteModal,
	showGetInviteModal : showGetInviteModal,
	showMakeMoveModal : showMakeMoveModal,
	showYourTurnModal : showYourTurnModal,
	showMoveSentModal : showMoveSentModal,
	showWaitingModal : showWaitingModal,
	showRejectModal : showRejectModal,
	showYouWinModal : showYouWinModal,
	showYouWinFriendQuitModal : showYouWinFriendQuitModal,
	showYouLoseModal : showYouLoseModal,
	showLoadingModal : showLoadingModal,
	showReplayModal : showReplayModal,
	showYesNoDialog : showYesNoDialog,
	killModal : killModal,
	showNotice : showNotice
    };
    
})();
