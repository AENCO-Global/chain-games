
// Function to merge images to a left screen for face book promotion.
// Dependancies : font @font-face {	font-family: 'badaboom';
//    								src: url('../img/BADABB_.TTF'); }
/* following code needs HTML injection for the font to load.
    <span style="font-family: 'myfontface#1font-family', badaboom, badaboom;"></span>
	function Paramters:
	leftImg : image of the player on the left, simple png or jpg
	leftName : Name of the left play, it will trim at 11 characters.
	leftScore : Score to display on the left
	rightImg : Image of the play on the right
	rightName : Name of the right player
	rightScore : score for the right player
	bg : back ground image with the size of 600 x 315
	winner : Winner, 0 = none, 1 = left side, 2 = Right Side
	callback : Call back function for getting the created image for broswer display
	callback64  : coded 64 image for web and data safe posting/

Notes: 2 image call backs available, as the 64 requires a step to create, so return both so not to throw anything away, if not needed just ignore it.
Written By: Geoffrey tipton, Esquire, PHP, Dr. LLB, Mltr
coppyright Chaatz, with permmision from Geoffrey Tipton.

Final Note. Enjoy.............
 */

var imageMerge = (function () {

var resultImg = function(leftImg,leftName,leftScore, rightImg, rightName, rightScore, bg, winner, callback, callback64 ){

	var winPromo=document.createElement("canvas");
	var ctx=winPromo.getContext("2d");
	var bgImgObj = new Image();
	var leftImgObj = new Image();
	var rightImgObj = new Image();
	var winImgObj = new Image();
	var drawImgObj = new Image();
	var iconImgObj = new Image();
	var bubbleImgObj = new Image();
	var profile = {w:177, h:177};  //Photo size
	var position = {leftTop:90,rightTop:17, left:45, right:393, win :{L:205,R:205,T:16}}; // Position of the Top and left side positions
	var textPos = {left:{ L: 134, T:265}, right:{L:480, T:192}, length:11}; // Position of the Top and left side positions
	var scorePos = {left:{ L: 200, T:217}, right:{L:390, T:218}, size:90}; // Position of the Top and left side positions
	var iconPos = {L:322,T:220,S:.8};  //s=scale
	console.log(ctx);
	// check error states and place valid values
	if (''==leftImg) {  leftImg = './img/user.jpg' };
	if (''==rightImg) {	rightImg = './img/user.jpg'};
	if (''== leftName )	{leftName = 'Guest'};
	if (''==leftScore )	{leftScore = '0'};
	if (''==rightName )	{rightName = 'Opponent'};
	if (''==rightScore ){rightScore = '0'};
	bg = './img/winbg.jpg';



	// swapt the winner to position 2
	if (1==winner){
		var t1 = rightImg; 
		var t2 = rightName; 
		var t3 = rightScore;

		rightImg 	= leftImg ;
		rightName	= leftName;
		rightScore	= leftScore;

		leftImg 	= t1; 
		leftName	= t2;
		leftScore 	= t3;
	}

	winImgObj.src = './img/Win.png';  // The main back ground image
	drawImgObj.src = './img/draw.png';  // change to draw
	bgImgObj.src = bg;  // The main back ground image
   	bgImgObj.crossOrigin = "anonymous";

	bgImgObj.onload = function() { //========================================||
		winPromo.width = bgImgObj.width;
		winPromo.height = bgImgObj.height;
		ctx.drawImage(bgImgObj, 0, 0, ctx.canvas.width,ctx.canvas.height);  // Place the main background here

		// Player 1 left ----------------------------------------------||
		$.get(leftImg.replace(/^.*\/\/[^\/]+/, '') )
	    .done(function() { // Do something now you know the image exists.
			leftImgObj.src = leftImg.replace(/^.*\/\/[^\/]+/, '');
	    }).fail(function() { 
	        // Image doesn't exist - do something else.
			leftImgObj.src = './img/user.jpg';
	    }).always(function(){  // the image should be loaded and selected here.
			console.log("Image Left:",leftImgObj.src);
			leftImgObj.crossorigin = "anonymous";

		   leftImgObj.onload = function() {
		    	var cw = profile.w;
		    	var ch = profile.h;
				ctx.save();
			    ctx.beginPath();
			    ctx.arc(position.left +(profile.w/2), position.leftTop + (profile.h/2), profile.h/2, 0, Math.PI * 2, true);
			    ctx.closePath();
			    ctx.clip();

		    	ctx.drawImage(leftImgObj, position.left, position.leftTop,profile.w,profile.h);
			    ctx.restore();

			   // Player 2 Right. ---------------------------------||

				$.get(rightImg.replace(/^.*\/\/[^\/]+/, '') )
			    .done(function() { // Do something now you know the image exists.
				   rightImgObj.src = rightImg.replace(/^.*\/\/[^\/]+/, '');
			    }).fail(function() { 
			        // Image doesn't exist - do something else.
					rightImgObj.src = './img/user.jpg';
			    }).always(function(){  // the image should be loaded and selected here.
					console.log("ImageRight:",leftImgObj.src);
					rightImgObj.crossOrigin = "anonymous";

					rightImgObj.onload = function() {
						ctx.save();
					    ctx.beginPath();
					    ctx.arc(position.right +(profile.w/2), position.rightTop + (profile.h/2), profile.h/2, 0, Math.PI * 2, true);
					    ctx.closePath();
					    ctx.clip();
					    ctx.drawImage(rightImgObj, position.right, position.rightTop, profile.w, profile.h);
					    ctx.restore();

						ctx.font = '44px badaboom';
						ctx.textAlign = 'center';
						ctx.lineWidth = 3;
						ctx.fillStyle = 'yellow';
						ctx.strokeStyle = 'black';
						ctx.textBaseline='top';
						
						ctx.fillText(leftName.substring(0,textPos.length),textPos.left.L,textPos.left.T);
						ctx.strokeText(leftName.substring(0,textPos.length),textPos.left.L,textPos.left.T);
						// right Name
						ctx.fillText(rightName.substring(0,textPos.length),textPos.right.L,textPos.right.T);
						ctx.strokeText(rightName.substring(0,textPos.length),textPos.right.L,textPos.right.T);

						iconImgObj.src = './img/title.png';
					    leftImgObj.crossOrigin = "anonymous";
						iconImgObj.onload = function() {
						    ctx.drawImage(iconImgObj, iconPos.L-(iconImgObj.width/2), iconPos.T,(iconImgObj.width*iconPos.S),(iconImgObj.height*iconPos.S));
							// finally place the Win Star
							if (1==winner){ // Left Wins
							    ctx.drawImage(winImgObj, position.win.L, position.win.T);
							} else if (2==winner) { // Right Wins
							    ctx.drawImage(winImgObj, position.win.R, position.win.T);
							} else { // Its a draw, display nothing
							    ctx.drawImage(drawImgObj, position.win.R, position.win.T);
							}

							bubbleImgObj.src = './img/bubbles.png';
							bubbleImgObj.onload = function() {
								ctx.drawImage(bubbleImgObj,  position.left*.3, position.leftTop );

								try {
							    	var img = winPromo.toDataURL("image/jpg").replace(/^data:image\/(png|jpg);base64,/, "");
							    	callback64(img);  //prod-callback
								} catch(err) {
									console.log(err);
								} // try
							    callback(winPromo);  //Test-callback
							}
						}; // iconImgObj.onload = function() {
					};
			    }); //  --$.get(rightImg.replace(/^.*\/\/[^\/]+/, '') ) ---||
			};
	    }); // -- .get(leftImg.replace....) ----------------------------||
	}; // == bgImgObj onload =================================================||



	} // end of image merge

	return{
		resultImg : resultImg
	};

})();