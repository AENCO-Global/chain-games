var env = [];
env.server = "dev-ap-games.chaatz.com"; // change this from the server
env.port = '8001'; 								//change from the deployment
env.socket = env.server+':'+env.port;		
env.room = 'BS4';  //Default
env.user = Math.floor((Math.random() *1000)+1) ;  // A random default
env.version = "{{version}}" ;  // A random default 
env.connected = false;
env.popupTimeout = 2500
env.commsMethod = "";
env.autoClose = false; // Used to close the view.
env.conflict = false; // if a conflict happened, set this to true, then false on send move.
env.defaultData = {
    "game": "bs",
    "gid" : "",
    "type": "",
    "state": "",
    "turn": "00",
    "data": {
        "move": "01"
    },
    "profile": {
        "me" :{"uid":"leftguy","name":"bob","img":"./img/user.jpg","LOC":"","score":1},
        "yo" :{"uid":"rightguy","name":"alice","img":"./img/user.jpg","LOC":"","score":2}
    },
    "version":"V1.2.003"
};

env.board = {"cells": { "00":"","01":"","02":"","03":"","04":"","05":"","06":"",
                        "10":"","11":"","12":"","13":"","14":"","15":"","16":"",
                        "20":"","21":"","22":"","23":"","24":"","25":"","26":"",
                        "30":"","31":"","32":"","33":"","34":"","35":"","36":"",
                        "40":"","41":"","42":"","43":"","44":"","45":"","46":"",
                        "50":"","51":"","52":"","53":"","54":"","55":"","56":"",
                        "60":"","61":"","62":"","63":"","64":"","65":"","66":""
                    },
            "ships":[
                        {locations:[],hits:[],dir:""},
                        {locations:[],hits:[],dir:""},
                        {locations:[],hits:[],dir:""},
                        {locations:[],hits:[],dir:""}
                    ],
            "guesses": "0",
            "shipsSunk": "0"
        };

env.data = env.defaultData;


env.count = 0;
env.placed = 0;
env.boardSize  = 7;

env.maxShips = 3;
env.numShips = 4;
env.shipSize;

env.guesses = 0;
env.shipsSunk = 0;
env.ships = [
    { locations: [], hits: [] },
    { locations: [], hits: [] },
    { locations: [], hits: [] },
    { locations: [], hits: [] }
];

/*  Enemy config data */

env.enemyGuesses = 0;
env.enemyShipsSunk = 0;
env.enemyShips = [
    { locations: [], hits: [] },
    { locations: [], hits: [] },
    { locations: [], hits: [] },
    { locations: [], hits: [] }
];


// env.dummy = JSON.parse('{ \
// "game":"bs", \
// "gid":"'+new Date().getTime()+'", \
// "type":"start", \
// "state":"", \
// "turn":"", \
// "data": { \
// "move":"01", \
// "U001":{"00":"","01":"","02":"","03":"","04":"","05":"","06":"","10":"","11":"","12":"","13":"","14":"","15":"","16":"","20":"","21":"","22":"","23":"","24":"","25":"","26":"","30":"","31":"","32":"","33":"","34":"","35":"","36":"","40":"","41":"","42":"","43":"","44":"","45":"","46":"","50":"","51":"","52":"","53":"","54":"","55":"","56":"","60":"","61":"","62":"","63":"",  "64":"","65":"","66":"" }, \
// "U002":{"00":"","01":"","02":"","03":"","04":"","05":"","06":"","10":"","11":"","12":"","13":"","14":"","15":"","16":"","20":"","21":"","22":"","23":"","24":"","25":"","26":"","30":"","31":"","32":"","33":"","34":"","35":"","36":"","40":"","41":"","42":"","43":"","44":"","45":"","46":"","50":"","51":"","52":"","53":"","54":"","55":"","56":"","60":"","61":"","62":"","63":"",  "64":"","65":"","66":"" } \
// }, \
// "profile": { \
// "me" :{"uid":"'+Math.floor((Math.random() *1000)+1)+'","name":"BoB","img":"","LOC":""}, \
// "yo" :{"uid":"'+Math.floor((Math.random() *1000)+1)+'","name":"Jane","img":"","LOC":""} \
// }, \
// "version":"V1.2.003" \
// }');

//   var dragAndDrop = function(){
        // var imgoffset = 0; 
        // $('.rTableCell').on('touchstart',function(event){
        //  console.log(this);
        //  $('<div id="drag-container" class="shipdrag"><img id="dragimg" src=""></div>').appendTo('#myboard');

        //  if ($(this).is('.ship1-single')) {
        //      $('#dragimg').attr("src","../img/ship1.png");
        //      $('#dragimg').css("width","14vw");
        //      $('#dragimg').css("height","6vh");
        //      imgoffset = 14*(100 / document.documentElement.clientWidth);
        //  }
        //  if ($(this).is('.ship2-left, .ship2-right')) { 
        //      $('#dragimg').attr("src","../img/ship2.png");
        //      $('#dragimg').css("width","26vw");
        //      $('#dragimg').css("height","8vh");
        //      imgoffset = 26*(100 / document.documentElement.clientWidth);
        //  }
        //  if ($(this).is('.ship3-left, .ship3-mid, .ship3-right')) { 
        //      $('#dragimg').attr("src","../img/ship3.png");
        //      $('#dragimg').css("width","38vw");
        //      $('#dragimg').css("height","10vh");
        //      imgoffset = 38*(100 / document.documentElement.clientWidth);
        //  }
        //  if ($(this).is('.ship4-left, .ship4-left-mid, .ship4-right-mid, .ship4-right')) { 
        //      $('#dragimg').attr("src","../img/ship4.png");
        //      $('#dragimg').css("width","54vw");
        //      $('#dragimg').css("height","10vh");
        //      imgoffset = 54*(100 / document.documentElement.clientWidth);
        //  }

        // });
        // $('.rTableCell').on('touchmove',function(event){
        //  event.preventDefault();
        //  var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
        //  $('#drag-container').css("left",touch.pageX-(imgoffset*7));
        //  $('#drag-container').css("top",touch.pageY-30);
        // });
        // $('.rTableCell').on('touchend',function(event){
        //  $('#drag-container').remove();
        //  console.log(event);
        // });
  //   }
