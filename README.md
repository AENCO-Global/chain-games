## Game Message For XMPP

## Message Type

### First Move

Message for initiating a game with the first move

```
<message type="chat" from="user1@ap.chaatz.com" to="user2@ap.chaatz.com" id="85267973342-9CE869EF-600F-4DAC-AA3D-D3D3FF14C77C">
    <cz xmlns="cz:ext" type="game:firstMove">
        <id>GAME_ID_1</id>
        <name>GAME_NAME_1</name>
        <icon>http://d2sge929g8wv4v.cloudfront.net/temporary/547bf76886816.jpeg</icon>
        <info>GAME_MOVE</info>
    </cz>
</message>
```
---

### Move

Message contains player's move and other info.

```
<message type="chat" from="user1@ap.chaatz.com" to="user2@ap.chaatz.com" id="85267973342-9CE869EF-600F-4DAC-AA3D-D3D3FF14C77C">
    <cz xmlns="cz:ext" type="game:move">
        <id>GAME_ID_1</id>
        <name>GAME_NAME_1</name>
        <icon>http://d2sge929g8wv4v.cloudfront.net/temporary/547bf76886816.jpeg</icon>
        <info>GAME_MOVE</info>
    </cz>
</message>
```
---

### Last Move

Message for ending a game with last move and the result.

```
<message type="chat" from="user1@ap.chaatz.com" to="user2@ap.chaatz.com" id="85267973342-9CE869EF-600F-4DAC-AA3D-D3D3FF14C77C">
    <cz xmlns="cz:ext" type="game:lastMove">
        <id>GAME_ID_1</id>
        <name>GAME_NAME_1</name>
        <icon>http://d2sge929g8wv4v.cloudfront.net/temporary/547bf76886816.jpeg</icon>
        <info>GAME_MOVE</info>
    </cz>
</message>
```
---

### Quit (Resign)

Message to quit a game. The opponent will win.

```
<message type="chat" from="user1@ap.chaatz.com" to="user2@ap.chaatz.com" id="85267973342-9CE869EF-600F-4DAC-AA3D-D3D3FF14C77C">
    <cz xmlns="cz:ext" type="game:quit">
        <id>GAME_ID_1</id>
        <name>GAME_NAME_1</name>
        <icon>http://d2sge929g8wv4v.cloudfront.net/temporary/547bf76886816.jpeg</icon>
    </cz>
</message>
```

---

## Javascript Methods

### Sending Game Message

    /*
     * Send game message 
	 *
	 * @method sendGameMessage
	 * @param gameId	- game id
	 * @param type		- 'firstMove'/'lastMove'/'move'/'quit'
	 * @param message 	- message body/nil
     */
     
    var sendGameMessage = function(gameId, type, message) {}
    
### Receiving Game Message

* Native dispatch game message and display in chatroom.
* Store game message to local storage by __$root/[game_id]/index.html?[game_id]&data=[some data in json format url encoded]__
* Only when webview is on with current page on the same game as received message will the message be processed and game UI get refresh.
    
### reportGameResult

    /*
     * Report game result
	 *
	 * @method reportGameResult
	 * @param gameId	- game id
	 * @param result	- result in json
     */
    var reportGameResult = function(gameId, result) {}

---
### Game ID's
    Please note the folder structures depend on the game ID so for example.

__$root/[game_id]/__ is the game home location.  
__$root/[game_id]/icon.gif__ is the animated icon  
__$root/[game_id]/icon.png__ is the static icon  
__$root/index.html?[game_id]__ is to start the specific game from the host  
__$root/[game_id]/index.html?[game_id]&data=[some data in json format url encoded]__ for a game move or game start request using the above mentioned syntax and command structures.  

| Game ID       | Title                | Description |
| ------------- |:--------------------:| -----------:|
| ttt           | Tik Tac Toe          |             |
| sps           | Stone Paper Scissor  |             |
