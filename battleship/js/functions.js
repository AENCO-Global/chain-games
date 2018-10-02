/**
 * Game logic holder
 * @class functions
 */
var functions = (function () {

	var count = 0;    
    var numShips = 4;
    var boardSize = 7;
    var shipSize;
    var ships = [
			{ locations: [], hits: [], dir: "" },
			{ locations: [], hits: [], dir: "" },
			{ locations: [], hits: [], dir: "" },
			{ locations: [], hits: [], dir: "" }
		];

	var ship1H = ["ship1-single"];
    var ship2H = ["ship2-left", "ship2-right"];
    var ship3H = ["ship3-left", "ship3-mid", "ship3-right"];
	var ship4H = ["ship4-left", "ship4-left-mid", "ship4-right-mid", "ship4-right"];

	var shipX1 = ["shipX1-single"];
    var shipX2 = ["shipX2-left", "shipX2-right"];
    var shipX3 = ["shipX3-left", "shipX3-mid", "shipX3-right"];
    var shipX4 = ["shipX4-left", "shipX4-left-mid", "shipX4-right-mid", "shipX4-right"];

	var ship1V = ["shipUp1-single"];
	var ship2V = ["shipUp2-top", "shipUp2-bot"];
	var ship3V = ["shipUp3-top", "shipUp3-mid", "shipUp3-bot"];
    var ship4V = ["shipUp4-top", "shipUp4-top-mid", "shipUp4-bot-mid", "shipUp4-bot"];

    var shipUpX1 = ["shipUpX1-single"];
    var shipUpX2 = ["shipUpX2-top", "shipUpX2-bot"];
    var shipUpX3 = ["shipUpX3-top", "shipUpX3-mid", "shipUpX3-bot"];
    var shipUpX4 = ["shipUpX4-top", "shipUpX4-top-mid", "shipUpX4-bot-mid", "shipUpX4-bot"];

    var arrXH = [shipX1, shipX2, shipX3, shipX4];
	var arrXV = [shipUpX1, shipUpX2, shipUpX3, shipUpX4];
	var arrH  = [ship1H, ship2H, ship3H, ship4H];
	var arrV  = [ship1V, ship2V, ship3V, ship4V];

	var imgH = ["<img id='1' name='H' class='ship1-is-dragging' src='../img/ship1.png' />",
				"<img id='2' name='H' class='ship2-is-dragging' src='../img/ship2.png' />",
				"<img id='3' name='H' class='ship3-is-dragging' src='../img/ship3.png' />",
				"<img id='4' name='H' class='ship4-is-dragging' src='../img/ship4.png' />"];

	var imgV = ["<img id='1' name='V' class='ship1v-is-dragging' src='../img/shipUp1.png' />",
				"<img id='2' name='V' class='ship2v-is-dragging' src='../img/shipUp2.png' />",
				"<img id='3' name='V' class='ship3v-is-dragging' src='../img/shipUp3.png' />",
				"<img id='4' name='V' class='ship4v-is-dragging' src='../img/shipUp4.png' />"];

    var shipTypes = ["ship1-single","shipUp1-single",
    				"ship2-left","ship2-right","shipUp2-top","shipUp2-bot",
    				"ship3-left","ship3-mid","ship3-right","shipUp3-top","shipUp3-mid","shipUp3-bot",
    				"ship4-left","ship4-left-mid","ship4-right-mid","ship4-right",
    				"shipUp4-top","shipUp4-top-mid","shipUp4-bot-mid","shipUp4-bot"];
    var allShips = ["flame",			
    				"shipX1-single",
    				"shipX2-left","shipX2-right",
    				"shipX3-left","shipX3-mid","shipX3-right",
    				"shipX4-left","shipX4-left-mid","shipX4-right-mid","shipX4-right",
    				"shipUpX1-single",
    				"shipUpX2-top","shipUpX2-bot",
    				"shipUpX3-top","shipUpX3-mid","shipUpX3-bot",
    				"shipUpX4-top","shipUpX4-top-mid","shipUpX4-bot-mid","shipUpX4-bot"];

    var reset = function() {
		count = 0;				
		ships = env.data.data[env.data.profile.me.uid]["ships"];		
		for (var i=0; i<numShips; i++) {			
			if (ships[i].dir === "H") {			
				deleteShip(ships[i].locations, arrH[ships[i].locations.length-1]);
			} else if (ships[i].dir === "V") {
				deleteShip(ships[i].locations, arrV[ships[i].locations.length-1]);
			}
		}
		ships = [
			{ locations: [], hits: [], dir: "" },
			{ locations: [], hits: [], dir: "" },
			{ locations: [], hits: [], dir: "" },
			{ locations: [], hits: [], dir: "" }
		];
		randomizeShipLocations();
    }
        
    var randomizeShipLocations = function() {
    	env.data.data[env.data.profile.me.uid] = env.board;
    	// env.data.data[env.data.profile.yo.uid] = env.board;    	
		var locations;
		var size = [4,1,3,2];		
		for (var i=0; i<numShips; i++) {
			do {
				var res = randomizeShip(size[i]);
			} while (collision(res[0]));			
			ships[i].locations = res[0];			
			ships[i].hits = res[1];
			ships[i].dir = res[2];
			if (res[2] == "H") {				
				makeShip(res[0], arrH[res[0].length-1]);
			} else {				
				makeShip(res[0], arrV[res[0].length-1]);	
			}
		}
		env.data.data[env.data.profile.me.uid]["ships"] = ships;
		setShipLocations();		
	}	
	
	var randomizeShip = function(size) {
		var direction = Math.floor(Math.random() * 2);
		var row, col, dir;

		if (direction === 1) { // horizontal
			dir = "H";
			row = Math.floor(Math.random() * boardSize);
			col = Math.floor(Math.random() * (boardSize - size + 1));
		} else { // vertical
			dir = "V";
			row = Math.floor(Math.random() * (boardSize - size + 1));
			col = Math.floor(Math.random() * boardSize);
		}

		var newShipLocations = [];
		var hits = [];
		for (var i=0; i<size; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
				hits.push("");
			} else {
				newShipLocations.push((row + i) + "" + col);
				hits.push("");
			}
		}
		return [newShipLocations, hits, dir];
	}
	
    /*	Current player ship board 	*/
    var setShipLocations = function() { 
    	
		$( ".drag" ).draggable({            
            stack: '.MyBattleshipsRow',
            cursor: 'move',
            revert: true
		});	
	
		$( "#myboard div.rTableCell" ).droppable({        
	        drop: handleDrop
		});

		$( "#myboard > .rTableRow > div.rTableCell" ).unbind('click').click(function(event) {
		    event.stopPropagation();		   	
		   	var id = $(this).attr('id');
		   	for (var i=0; i<numShips; i++) {				// iterate all ships
		   		var ship = ships[i] //.locations;			//	[] array
		   		var shipArray = ship.locations;
		   		if (shipArray.indexOf(id) >= 0 && shipArray.length != 1) {				//	if you find the id in the ship.locations array
		   			if (ship.dir === "H") {
		   				if (shipArray.length == 4 || shipArray.length == 3) {						   		
					   		rotateShip34_V(shipArray[1], i, shipArray);
					   	} else {						   		
					   		rotateShip2_V(shipArray[0], i, shipArray);
					   	} 
		   			} else {
		   				if (shipArray.length == 4 || shipArray.length == 3) {		   						
					   		rotateShip34_H(shipArray[1], i, shipArray);
					   	} else {						   		
					   		rotateShip2_H(shipArray[0], i, shipArray);
					   	}
		   			}
		   		} else if (shipArray.indexOf(id) >= 0 && shipArray.length == 1) {		   				    		
		   			toggleShip(id, i);	
		   		}
		   	}
		});

		$( "#myboard > .rTableRow > div.rTableCell" ).draggable({            
            helper : function() {
            	var id = $(this).attr('id');
			   	for (var i=0; i<numShips; i++) {				// iterate all ships
			   		var ship = ships[i] 						//	[] array			   		
			   		if (ship.locations.indexOf(id) >= 0) {				//	if you find the id in the ship.locations array
			   			if (ship.dir === "H") {
			   				return $(imgH[ship.locations.length-1]);
			   			} else {
			   				return $(imgV[ship.locations.length-1]);
			   			}
			   		}
			   	}
            }    
        });
    }

    var handleDrop = function(event, ui) {
        playSound("place");
		event.stopPropagation();
		var id = $(this).attr('id');              // gives the cell number                                 
		
		shipSize = ui.helper.attr('id');		
		var source_ID = ui.draggable.attr('id');
		var dir = ui.helper.attr('name');	

		var row = id.charAt(0);        
		var col = id.charAt(1);
		var col_int = parseInt(col);
		var row_int = parseInt(row);
		var isDropped;

		var index;	
		for (var i=0; i<numShips; i++) {				// iterate all ships		   	
		   	if (ships[i].locations.indexOf(source_ID) >= 0) {		   		
		   		index = i;
		   	}
		}

		if (dir == "H") {
			if (col_int > 0 && parseInt(shipSize) > 2) {
				col_int--;				//	to adjust the ships from the left
			}
			isDropped = generateShipLocations(row, col_int.toString(), index, "H");
		} else {
			if (row_int > 0 && parseInt(shipSize) > 2) {
				row_int--;
			}
			isDropped = generateShipLocations(row_int.toString(), col, index, "V");			
		}

		if (isDropped) {
	        $("#place")[0].play(); // play Placed sound
			ui.draggable.draggable('disable');
		}	
    }
    
    var generateShipLocations = function(row, col, index, dir) {
    	var cell_no, arrType;
    	if (dir == "H") {
    		cell_no = parseInt(col);
    		arrType = arrH;
    	} else {
    		cell_no = parseInt(row);
    		arrType = arrV;
    	}
    	if (boardSize - cell_no >= shipSize) {	  
		    var res = generateShip(row, col, dir);
		    var hits = res[1];
		    var locations = res[0];
		    if (collision(locations, index)) {
				modals.showNotice("Oops !! Ship is already placed over here..");
		    } else {
				if (index != undefined) {		    		
		    		deleteShip(ships[index].locations, arrType[ships[index].locations.length-1]);
		    		ships[index].locations = locations;		    		
		    	} else {
					ships[count].locations = locations;
					ships[count].hits = hits;
					ships[count].dir = dir;
					count++;									
				}				
				makeShip(locations, arrType[shipSize-1]);												
				shipSize = null;				
				env.data.data[env.data.profile.me.uid]["ships"] = ships;							    
				return true;
		    }
		} else {
		    modals.showNotice("Cannot place ship at this location... Lacking space!!");
		}
		return false;
    }

    var toggleShip = function(id, index) {
    	var cells = env.data.data[env.data.profile.me.uid]["cells"];    	   	
    	if (cells[id] == "ship1-single") {
    		cells[id] = "shipUp1-single";
    		ships[index].dir = "V";
    		$("#myboard > .rTableRow > #"+ id).removeClass("ship1-single");
    		$("#myboard > .rTableRow > #"+ id).addClass("shipUp1-single");
    	} else if (cells[id] == "shipUp1-single") {
    		cells[id] = "ship1-single";
    		ships[index].dir = "H";
    		$("#myboard > .rTableRow > #"+ id).removeClass("shipUp1-single");
    		$("#myboard > .rTableRow > #"+ id).addClass("ship1-single");
    	}
    	env.data.data[env.data.profile.me.uid]["ships"] = ships;
    	env.data.data[env.data.profile.me.uid]["cells"] = cells;
    }

    var rotateShip2_H = function(pivot, index, shipArray) {				// rotate the ship2 to horizontal direction
    	var row = pivot.charAt(0);
    	var col = pivot.charAt(1);     	
    	var colInt = parseInt(col);
    	if ((colInt+1)<boardSize) {									//	check if the rotation in horizontal direction has enough space
    		var myArray = []; 
    		var arr = [0,1];
    		for (var i=0; i<arr.length; i++) {
    			var loc = colInt + arr[i];
    			myArray[i] = row + loc.toString();					//	generate & collect all the cell locations required for rotation
    		}
    		if (collision([myArray[1]])) {							//	check if generated location collides with existing ship at that place
    			modals.showNotice("Oops !! cannot rotate the ship..");			//	except the pivot element
    		} else {    			
    			deleteShip(shipArray, ship2V);
    			makeShip(myArray, ship2H);
    			ships[index].locations = myArray;
    			ships[index].dir = "H";															//	update the direction
    			env.data.data[env.data.profile.me.uid]["ships"] = ships;    			  			
    		}
    	} else {
    		modals.showNotice("Cannot rotate the ship in horizontal direction...lacking space");
    	}    	
    }

    var rotateShip2_V = function(pivot, index, shipArray) {				// rotate the ship4 to vertical direction
    	var row = pivot.charAt(0);
    	var col = pivot.charAt(1);     	
    	var rowInt = parseInt(row);
    	if ((rowInt+1)<boardSize) {
    		var myArray = []; 
    		var arr = [0,1];
    		for (var i=0; i<arr.length; i++) {
    			var loc = rowInt + arr[i];
    			myArray[i] = loc.toString() + col;    			
    		}
    		if (collision([myArray[1]])) {
    			modals.showNotice("Oops !! cannot rotate the ship..");
    		} else {    			
    			deleteShip(shipArray, ship2H);
    			makeShip(myArray, ship2V);
    			ships[index].locations = myArray;
    			ships[index].dir = "V";
    			env.data.data[env.data.profile.me.uid]["ships"] = ships;    			    			
    		}
    	} else {
    		modals.showNotice("Cannot rotate the ship in vertical direction...lacking space");
    	}    	
    }

    var rotateShip34_H = function(pivot, index, shipArray) {
    	var row = pivot.charAt(0);
    	var col = pivot.charAt(1);    	
    	var colInt = parseInt(col);
    	var myArray = [];
    	if (shipArray.length == 3) {
    		var arr = [-1,0,1];
    		var shipH = ship3H;
    		var shipV = ship3V;
    		var len = 1;
    	} else {
    		var arr = [-1,0,1,2];
    		var shipH = ship4H;
    		var shipV = ship4V;
    		var len = 2;
    	}    	
    	if (colInt>0 && (colInt+len)<boardSize) {
    		var tempArray = []; 		
    		for (var i=0,j=0; i<arr.length; i++) {
    			var loc = colInt + arr[i];
    			myArray[i] = row + loc.toString();
    			if (i+1 != 2) {
    				tempArray[j++] = row + loc.toString();
    			}
    		}
    		if (collision(tempArray)) {
    			modals.showNotice("Oops !! cannot rotate the ship..");
    		} else {    			
    			deleteShip(shipArray, shipV);
    			makeShip(myArray, shipH);
    			ships[index].locations = myArray;
    			ships[index].dir = "H";
    			env.data.data[env.data.profile.me.uid]["ships"] = ships;    			   			
    		}
    	} else {
    		modals.showNotice("Cannot rotate the ship in horizontal direction...lacking space");
    	}
    }
        
    var rotateShip34_V = function(pivot, index, shipArray) {				// rotate the ship4 to vertical direction    	
    	var row = pivot.charAt(0);    
    	var col = pivot.charAt(1);    	
    	var rowInt = parseInt(row);
    	var myArray = [];    	
    	if (shipArray.length == 3) {
    		var arr = [-1,0,1];
    		var shipH = ship3H;
    		var shipV = ship3V;
    		var len = 1;
    	} else {
    		var arr = [-1,0,1,2];
    		var shipH = ship4H;
    		var shipV = ship4V;
    		var len = 2;
    	}    	
    	if (rowInt>0 && (rowInt+len)<boardSize) {
    		var tempArray = []; 		
    		for (var i=0,j=0; i<arr.length; i++) {
    			var loc = rowInt + arr[i];
    			myArray[i] = loc.toString() + col;
    			if (i+1 != 2) {
    				tempArray[j++] = loc.toString() + col;
    			}
    		}
    		if (collision(tempArray)) {
    			modals.showNotice("Oops collision !! cannot rotate the ship..");
    		} else {    			
    			deleteShip(shipArray, shipH);
    			makeShip(myArray, shipV);
    			ships[index].locations = myArray;
    			ships[index].dir = "V";
    			env.data.data[env.data.profile.me.uid]["ships"] = ships;    			 			
    		}
    	} else {
    		modals.showNotice("Cannot rotate the ship in vertical direction...lacking space");
    	}    	
    }

    var generateShip = function(row, col, dir) {
    	var locations = [];
    	var hits = [];
		for (var i=0; i<shipSize; i++) {
			if (dir == "H") {
				locations.push(row + "" + (parseInt(col) + i));      // horizontal direction
			} else if (dir == "V") {
		    	locations.push((parseInt(row) + i)+ "" + col);      // vertical direction
		    }
		    hits.push("");
		}
		return [locations,hits];
    }

    var makeShip = function(locations, ship) {
		var size = locations.length;
		var cells = env.data.data[env.data.profile.me.uid]["cells"];
		for (var i=0; i<size; i++) {			        
			$("#myboard > .rTableRow > #"+locations[i]).addClass(ship[i]);
			cells[locations[i]] = ship[i];
		}
		env.data.data[env.data.profile.me.uid]["cells"] = cells;
	}

	var deleteShip = function(locations, ship) {
		var size = locations.length;
		var cells = env.data.data[env.data.profile.me.uid]["cells"];
		for (var i=0; i<size; i++) {			        
			$("#myboard > .rTableRow > #"+locations[i]).removeClass(ship[i]);
			cells[locations[i]] = "";
		}
		env.data.data[env.data.profile.me.uid]["cells"] = cells;
	}

    var collision = function(locations, index=undefined) {
    	for (var i=0; i<numShips; i++) {
    		if (index == i) { continue; }
		    var ship = ships[i];
		    for (var j=0; j<locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
				    return true;
				}
		    }
		}
		return false;
    }

    /*	Attack the 'yo' user shipboard */

    var attack = function() {
    	var turn = true;    	
    	var enemyLocations = env.data.data[env.data.profile.yo.uid]["cells"];    	
    	initEnemyBoard(enemyLocations);
    	$( "#theirboard div.rTableCell" ).unbind('click').click( function(event) {
	        event.stopPropagation();
	        if (turn) {
		        var id = $(this).attr('id');	        
	    		var goodShot = firedByMe(id, env.data.data[env.data.profile.yo.uid]["cells"]);	    		
	    		if (goodShot[0] == true || goodShot[1] == 1) {
		    		turn = false;
		    		env.data.data.move = id;
		    		setTimeout(function() { // Send the attack after the user has clicked the board....
			    		scenes.shipMenuDialog('attack');
		    		}, env.popupTimeout);
		    	}
	    	}
    	});
    }

    var initEnemyBoard = function(enemyLocations) {  	
    	for (var key in enemyLocations) {
    		if (!(shipTypes.indexOf(enemyLocations[key]) >= 0)) {    			
				$("#theirboard > .rTableRow > #"+ key).addClass(enemyLocations[key]); 
			} 
    	}
    }

    var firedByMe = function(guess, enemyLocations) {    	
    	var board = "#theirboard > .rTableRow > #";
    	var incr = parseInt(env.data.data[env.data.profile.me.uid]["guesses"]) + 1;	// increment the guess    	
    	env.data.data[env.data.profile.me.uid]["guesses"] = incr.toString();
    	var ship = env.data.data[env.data.profile.yo.uid]["ships"];		// take the enemy ships    	  											
		for (var i=0; i<numShips; i++) {			
			var currShip = ship[i];																			
		    var index = currShip.locations.indexOf(guess);
		    if (currShip.hits[index] === "hit") {             // check if a ship location has already been hit
				modals.showNotice("Oops, you already hit that location");
				var decr = parseInt(env.data.data[env.data.profile.me.uid]["guesses"]) - 1;	// decrement the guess
				env.data.data[env.data.profile.me.uid]["guesses"] = decr.toString();
				return [false, 0];
		    } else if (index >= 0) {
                $("#hit")[0].play(); // play Sonar sound
				currShip.hits[index] = "hit";				
				$(board+guess).addClass("explode-hit");
				env.data.data[env.data.profile.yo.uid]["ships"][i] = currShip;				
				setTimeout(function() { // Shows explosion then changes class to a place holder.
			    	$(board+guess).removeClass("explode-hit");
			    	$(board+guess).addClass("flame");
			    	if ( isSunk(currShip, board, enemyLocations) ) {
                        playSound("sink");
			    		var sunkCount = parseInt(env.data.data[env.data.profile.me.uid]["shipsSunk"]) + 1;			    		
			    		env.data.data[env.data.profile.me.uid]["shipsSunk"] = sunkCount.toString();			    		
			        	if (sunkCount === numShips) {
			        		scenes.youWin();			// show game win
                            playSound("win");
                        	modals.showNotice("You sank all my battleships, in " + env.data.data[env.data.profile.me.uid]["guesses"] + " guesses");
						}
			    	} else {
			    		enemyLocations[guess] = "flame";			    		
			    		env.data.data[env.data.profile.yo.uid]["cells"] = enemyLocations;
			    	}
				}, 1100);	
				return [true, 1];
			}
		}
		if (enemyLocations[guess] == "") {
			$(board+guess).addClass("explode-miss");
	        $("#splash")[0].play(); // play Sonar sound
			setTimeout(function() {
				$(board+guess).removeClass("explode-miss");
				$(board+guess).addClass("miss");
			}, 1000);		
			enemyLocations[guess] = "miss";		
			env.data.data[env.data.profile.yo.uid]["cells"] = enemyLocations;
			return [false, 1];
		} else {
			modals.showNotice("Oops, you already hit that location");
			return [false, 0];
		}		
    }    
        
    var isSunk = function(ship, board, enemyLocations) {
		for (var i=0; i<ship.locations.length; i++) {
		    if (ship.hits[i] !== "hit") {
				return false;
		    }
		}				
		if (ship.dir == "H") {
			checkIsSunk(ship, board, arrXH[ship.locations.length-1], enemyLocations);
		} else if (ship.dir == "V") {
			checkIsSunk(ship, board, arrXV[ship.locations.length-1], enemyLocations);
		}		
		return true;
    }

    var checkIsSunk = function(ship, board, shipX, enemyLocations) {
    	for (var i=0; i<ship.locations.length; i++) {
			$(board+ship.locations[i]).removeClass("explode-hit flame");
			$(board+ship.locations[i]).addClass(shipX[i]);
			enemyLocations[ship.locations[i]] = shipX[i];
		}
		env.data.data[env.data.profile.yo.uid]["cells"] = enemyLocations;
    }

    /*	Defend the 'me' user shipboard */

    var defend = function() {
    	var move = env.data.data.move;    		
    	initOwnBoard(move);		// the incoming guess is coming from yo.
    	setTimeout(function() {
			    scenes.myAttack();	    	
    	}, 5000); 							
    }

    var initOwnBoard = function(move) {
    	var board = "#myboard > .rTableRow > #";
    	var myLocations = env.data.data[env.data.profile.me.uid]["cells"];
    	var meShips = env.data.data[env.data.profile.me.uid]["ships"];    	
    	for (var key in myLocations) {
    		if (key == move && allShips.indexOf(myLocations[key]) >=0) {
    			var str = getShipXClass(key, meShips);
    			var res = str.replace("X", "");
    			$(board+key).addClass(res);
    			replaceFlame(key, board, meShips);
    		} else if (key == move && myLocations[key] == "miss") {    			 			
    			replaceMiss(key, board);
    		} else if (myLocations[key] == "flame") {			//    			
    			var getClass = getShipXClass(key, meShips);			//	show all shipX
    			$(board+key).addClass(getClass);
    		} else {    					
    			$(board+key).addClass(myLocations[key]);		//	show them as usual	eg. miss, ships, shipX
    		}
    	}
    }    

    var replaceFlame = function(key, board, meShips) {				//	explode-hit and replace with shipX    	
    	setTimeout(function() {
            $("#hit")[0].play(); // play Sonar sound
    		$(board+key).addClass("explode-hit");
    		setTimeout(function() {
			    $(board+key).removeClass("explode-hit");
			    var getClass = getShipXClass(key, meShips);
			    $(board+key).addClass(getClass);			    	
    		}, 1000);
    	}, 1000);
    }

    var getShipXClass = function(key, meShips) {  	
		for (var i=0; i<numShips; i++) {
		    var ship = meShips[i];	    
		    var index = ship.locations.indexOf(key);
			if (index >= 0) {
				if (ship.dir == "H") {
					return arrXH[ship.locations.length-1][index];
				} else if (ship.dir == "V") {
					return arrXV[ship.locations.length-1][index];
				}			    
			}		    
		}
    }

    var replaceMiss = function(key, board) {
		setTimeout(function() {
            $("#splash")[0].play(); // play Sonar sound
    		$(board+key).addClass("explode-miss");
	    	setTimeout(function() {						//	show miss with delay of 1 sec
	    		$(board+key).removeClass("explode-miss");
	    		$(board+key).addClass("miss");
	    	}, 1000);
	    }, 1000);
    }

    function playSound(sound) {
        $("#"+sound).prop("currentTime",0);
        $("#"+sound)[0].play(); // play Placed sound
    }
    
    return{
        setShipLocations : setShipLocations,
        randomizeShipLocations : randomizeShipLocations,
        initOwnBoard : initOwnBoard,              
        attack : attack,
        defend : defend,
        reset : reset
    };

})();

functions.setShipLocations();
