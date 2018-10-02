/**
 * Database.js is a wrapper around a DB library which
 * stores records in WebSQL or the web based Golang storage
 * Therefore any new methods must be compatible with both storage mechanisms.
 * @class Database
 */
var Database = (function () {

    //Declare stores

    var ProfileStore, FriendsStore, ChatroomStore, ChatStore, MiscStore, PostsStore, CommentsStore, PostStore, LikesStore;


    //Check if HTML5 local storage is available and store the result in CONFIG
    if(window.localStorage){
	    console.log('Local storage available.');
	    CONFIG.IS_LOCALSTORAGE_AVAILABLE = true;

	    //Initialize stores
	    var ProfileStore = store.namespace('ProfileStore'); //Stores my profile data.
	    var ChatroomStore = store.namespace('ChatroomStore');
	    var ChatStore = store.namespace('ChatStore');
	    var FriendsStore = store.namespace('FriendsStore'); // Stores my Chaatz Friends.
	    var MiscStore = store.namespace('MiscStore'); // Stores random keypairs like JID/JP.

	    var PostsStore = store.namespace('PostsStore');
	    var PostStore = store.namespace('PostStore');
	    var CommentsStore = store.namespace('CommentsStore');
	    var LikesStore = store.namespace('LikesStore');
	    var ContactsStore = store.namespace('ContactsStore'); // Stores phone book contact lisk.


	    //Check if profile store is empty and redirect if not on welcome or registration page accordingly.
	    //Update the below check so it is cross platform.
	    // if(ProfileStore.size() == 0 && window.location.pathname != "/modules/register/index.html" && window.location.pathname != "/index_welcome.html"){

	    //     if(DEBUG) console.log('No profiles remaining, redirecting to Registration.');

	    //     if(NativeHook.isNativeApp()){

	    // 	//Android requires a bit different handling due to local file structure
	    // 	// var url = window.location.href;
	    // 	// window.location.href = url.substring(0, url.lastIndexOf('Web/')) + 'Web/modules/register/index.html';
	    //     }else{
	    // 	window.location.href = url.substring('http://' + document.location.host + '/modules/register/index.html');
	    //     }
	    // }

    }else{
	    console.log('Local storage not available.');
    }

    /**
     * Adds an identity to the existing phone profile.
     * @method addIdentity
     */
    var addIdentity  = function(identity){

	    // Store locally
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

	        //Load that same profile.
	        var loadedProfile = getProfile();
	        console.log(loadedProfile);

	        //Check if identity is new or not.
	        if(loadedProfile.identities.length == 0){

		        //No profiles, no need to check so just add.
		        loadedProfile.identities.push(identity);
	        }else{
		        var shouldAddIdentity = true;

		        //Check if identities contains the current identity, if so. overwrite.
		        for(var i = 0; i < loadedProfile.identities.length; i++){
		            // console.log(loadedProfile.identities[i]);
		            // console.log(profile.identity);

		            if(loadedProfile.identities[i] == identity){
			            shouldAddIdentity = false;
		            }
		        }

		        //Add only if it doesn't exist.
		        if(shouldAddIdentity) loadedProfile.identities.push(identity);
	        }

	        //Perform the upsert.
	        ProfileStore(loadedProfile.chaatzID, loadedProfile);
	    }else{
	        //Store on the server.
	    }
    };

    /**
     * Removes all chat rooms from the Database.
     * @method deleteAllConversations.
     */
    var deleteAllConversations  = function(identity){

	    // Store locally
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	        ChatroomStore.clear();
	        ChatStore.clear();

	        createNewsroom();
            //        mixpanel tracking
	        mixpanel.track("delete all conversations");
            //        mixpanel tracking
	        console.log('Chatrooms erased from time and space');
	    }else{
	        //Store on the server.
	    }
    };

    /**
     * Creates a profile in the database without adding an identity.
     * @method createProfileWithoutIdentity
     * sample request:
     */
    var createProfileWithoutIdentity  = function(chaatzID, profile){

	    var promise = $.Deferred();

	    // Store locally
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

	        //If the profile associated with the chaatz ID does not exist.
	        if(!$.isArray(getProfile())){

		        //Insert a new profile into the DB.
		        //debugger;
		        ProfileStore(
		            chaatzID, {
	    		        chaatzID : chaatzID,
	    		        PIN : "",
			            name : profile.name,
			            status : profile.status,
			            image : profile.image,
			            thumbnail : profile.thumbnail,
			            isChaatzConnectEnabled : profile.isChaatzConnectEnabled,
			            isExpired : profile.isExpired,
	    		        identities : [],
			            chaatzNumber : profile.chaatzNumber,
			            gender : profile.gender,
			            dob : profile.dob,
			            interest : profile.interests,
			            token : profile.token,
			            countryCode : profile.countryCode,
			            countryName : profile.countryName,
			            countryNameCode : profile.countryNameCode,
			            ipAddress : profile.ipAddress,
			            score: profile.score
		            }
		        );
	        }

	        //Load that same profile.
	        var loadedProfile = getProfile();

	        //Check if identity is new or not.
	        if(loadedProfile.identities.length == 0){

		        //No profiles, no need to check so just add.
		        loadedProfile.identities.push(profile.chaatzNumber);
	        }else{

		        var shouldAddIdentity = true;

		        //Check if identities contains the current identity, if so. overwrite.
		        for(var i = 0; i < loadedProfile.identities.length; i++){
		            // console.log(loadedProfile.identities[i]);
		            // console.log(profile.identity);

		            if(loadedProfile.identities[i] == profile.identity){
			            shouldAddIdentity = false;
		            }
		        }

		        //Add only if it doesn't exist.
		        if(shouldAddIdentity) loadedProfile.identities.push(profile.chaatzNumber);
	        }

	        //Perform the upsert.
	        ProfileStore(chaatzID, loadedProfile);
	        promise.resolve();
	    }else{
	        //Store on the server.
	    }

	    return promise;
    };

    /**
     * updateChaatzNumber [
     * @method updateChaatzNumber
     */
    var updateChaatzNumber = function(chaatzNumber){

	    var profile = getProfile();

	    profile.chaatzNumber = chaatzNumber;
	    profile.identities[0] = chaatzNumber;
	    Database.setObjectForKey("CN", chaatzNumber);

	    console.log('chaatz number updated');

	    ProfileStore(objectForKey("ChaatzID"), profile);
    }

    /**
     * updateProfile updates the database profile.
     * PARAMS: name, status, image, thumbnail, isExpired, isChaatzConnectEnabled, gender, dob, interest
     * @method updateProfile
     */
    var updateProfile = function(name, status, image, thumbnail, isExpired, isChaatzConnectEnabled, gender, dob, interest, score){

	    // Store locally
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

	        var loadedProfile = getProfile();

	        //ENCH: Put some data checking here.

	        loadedProfile.name = name;
	        loadedProfile.status = status;
	        loadedProfile.image = image;
	        loadedProfile.thumbnail = thumbnail;
	        loadedProfile.isExpired = isExpired;
	        loadedProfile.isChaatzConnectEnabled = isChaatzConnectEnabled;
	        loadedProfile.gender = gender,
	        loadedProfile.dob = dob,
	        loadedProfile.interest = interest,
	        loadedProfile.score = score

	        console.log(loadedProfile);

	        ProfileStore(objectForKey("ChaatzID"), loadedProfile);
	        console.log('Profile update performed.');
	    }else{
	        //Store on the server.
	    }
    }

    // /**
    //  * getAllProfiles returns all profiles in the database.
    //  * @method getAllProfiles
    //  */
    // var getAllProfiles  = function(){
    // 	if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
    // 	    return ProfileStore.getAll();
    // 	}else{
    // 	    //Serverside
    // 	}
    // };

    /**
     * getProfile returns the phones single profile.
     * @method getProfile
     */
    var getProfile  = function(){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	    	// debugger;
	        return ProfileStore.get(objectForKey("ChaatzID"));
	    }else{
	        //Serverside
	    }
    };

    /**
     * removeIdentity deletes a single identity (Chaatz Number or MSISDN) from the main profile.
     * @method removeIdentity
     */
    var removeIdentity  = function(identity){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

	        console.log('Removing ' + identity + ' from list of identities.');

	        var profile = getProfile();
	        console.log(profile.identities);

	        var index = profile.identities.indexOf(identity);
	        if(index != -1){
		        profile.identities.splice(index, 1);
	        }

	        ProfileStore(Database.objectForKey("ChaatzID"), profile);
	        console.log('Successfully removed identity: ' + identity);
	    }else{
	        //Serverside
	    }
    };

    /**
     * removeAllProfiles purges the profiles table of all profiles.
     * @method removeAllProfiles
     */
    var removeAllProfiles  = function(uid){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	        ProfileStore.clear();
	        console.log('Successfully removed all profiles.');
	    }else{
	        //Serverside
	    }
    };

    /**
     * getChatrooms gets all chatrooms from the database in a list.
     * @method getAllChatrooms
     */
    var getAllChatrooms = function(roomID){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	        var outputArray = [];
	        $.each(ChatroomStore.getAll(), function(key, value) {
		        outputArray.push(value);
	        });
	        return outputArray;
	    }else{
	        //Serverside
	    }
    };

    /**
     * getAllChatroomsFromIdentity gets all chatrooms from a specific identity.
     * @method getAllChatroomsFromIdentity
     */
    var getAllChatroomsFromIdentity = function(identity){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	        var outputArray = [];
	        $.each(ChatroomStore.getAll(), function(key, value) {
		        if(value.owner == identity){
		            outputArray.push(value);
		        }
	        });
	        return outputArray;
	    }else{
	        //Serverside
	    }
    };

    /**
     * getChatrooms gets non-empty chatrooms from the database in a list.
     * @method getNonEmptyChatrooms
     */
    var getNonEmptyChatrooms = function(roomID){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	        var outputArray = [];
	        $.each(ChatroomStore.getAll(), function(key, value) {
	    	    if (value.messages.length > 0) {
		    	    outputArray.push(value);
	    	    }
	        });
	        return outputArray;
	    }else{
	        //Serverside
	    }
    };
    /**
     * getPhoneNumberIdentities returns an array of phone numbers associated with profile.
     * @method getPhoneNumberIdentities
     */
    var getPhoneNumberIdentities = function(){

	    var profile = getProfile();

	    var phoneNumbers = [];

	    //Iterate through profiles looking for phone numbers.
	    $.each(profile.identities, function(key, value){
	        //Add only phone numbers to the array and return.
	        if (value.substring(0, 1) !== "*") {
		        phoneNumbers.push(value);
	        }
	    })
	        return phoneNumbers;
    };


    /**
     * getChatroom gets a single chatroom for the database.
     * @method getChatroom
     */
    var getChatroom = function(roomID){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	        return ChatroomStore.get(roomID);
	    }else{
	        //Serverside
	    }
    };

    // /**
    //  * getChatroomByPartner gets a chat room based off the partner of the chatroom.
    //  * @method getChatroomsByPartner
    //  */
    // var getChatroomByPartner = function(partner){
	//     if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

    //         var room = ChatroomStore.get(roomID);

	//         return room;
	//     }else{
	//         //Serverside
	//     }
    // };

    /**
     * isAccountConfirmed returns true if at least one of the users
     * identities is a phone number and false otherwise.
     * @method isAccountConfirmed
     */
    var isAccountConfirmed = function(){

	    var profile = getProfile();

	    var hasIdentity = false;

	    //Iterate through profiles looking for phone numbers.
	    $.each(profile.identities, function(key, value){
	        //If it doesnt start with * its not a Chaatz number.
	        if (value.substring(0, 1) !== "*") {
		        hasIdentity = true;
	        }
	    })

	        return hasIdentity;
    };

    /**
     * createChatroom creates a new chat room in the database.
     * @method createChatroom
     */
    var createChatroom  = function(roomID, senderName, thumbnail){

	    console.log('create chatroom');

	    // Store locally
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

	        var owner = roomID.split("-")[0];
	        var partner = roomID.split("-")[1];

	        if(DEBUG)console.log("");
	        console.log(senderName);

	        if(!UrlUtils.isURL(thumbnail)){
		        thumbnail = "../../img/icons/user-placeholder.jpg";
	        }

	        //Check that chat room doesn't exist already and receipient was in our identities list.
	        if(!ChatroomStore.has(roomID) && $.inArray(owner, getProfile().identities) != -1){
	    	    // //yInsert a new chat room into the DB.
	    	    ChatroomStore(
	    	        roomID, {
	    	    	    owner : owner,
	    	    	    partner: partner,
	    	    	    partnerName : senderName,
			            ownerName : getProfile().name,
	    	    	    partnerThumbnail :  thumbnail,
	    	    	    messages : [],
	    	    	    lastMessageTimestamp : "",
			            preview : "",
			            unreadMessageCount : 0
	    	        }
	    	    );
		        if(DEBUG)console.log('Database: Chat Room: ' + roomID + ' didnt exist but has been created.');
	        }else{
		        if(DEBUG)console.log('Database: Chat Room with '+ partner + ' already exists. No need to create.');
	        }
	    }else{
	        //Store on the server.
	    }
    };

    /**
     * createChatroom creates a new chat room in the database.
     * @method createChatroom
     */
    var updateChatroom  = function(roomID, room){
	    ChatroomStore(roomID, room);
    };

    /**
     * createNewsroom is mostly for convenience.
     * Creates a room in the database that receives chats news.
     * @method createNewsroom
     */
    var createNewsroom = function(){

	    if(!ChatroomStore.has("news")){
	        ChatroomStore(
		        "news", {
	    	        owner : "",
	    	        partner: "partner",
	    	        partnerName : "Chaatz Team",
	    	        partnerThumbnail : "../../img/icons/Chaatz-team-icon.png",
	    	        messages : [],
	    	        lastMessageTimestamp : Date.now(),
		            preview : "Welcome to Chaatz!"
		        }
	        );
	    }

	    //Predefined messages in news room.
	    addMessageParams("news", "Welcome to Chaatz!");
	    addMessageParams("news", "Chaatz Connect now has members from 100+ countries from all over the world. Did you know you can Chaatz and socialize with them using Chaatz Connect?");
	    // addMessageParams("news", "LIMITED OFFER! Get FREE Talktime worth INR 10 for your first successful");
    }

    /**
     * addMessage builds a message object based off parameters.
     * @method addMessageParams
     */
    var addMessageParams  = function(roomID, body){
	    //Store locally
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

	        // var roomID = message.msgSender + '-' + message.msgReceiver;
	        var room = getChatroom(roomID);

	        console.log(roomID);
	        console.log(room);

	        //Check if chat room exists.
	        if(room != null){

		        //Message format
		        var message = {};
		        message.msgid = "news"+Math.floor(Math.random() * (9999 - 1 + 1)) + 1;;
		        message.msgType = 200;
		        message.msgBody = body;
		        message.msgSender = 'Chaatz';
		        message.msgReceiver = '';
		        message.msgAttachment = "";
		        message.resid = "";
		        message.date = Date.now();
		        message.from = "Chaatz";// $(xml).attr('from')
		        message.to = "";
		        message.phone = "";
		        message.senderName = "";
		        message.isgroupmsg = false;
		        message.self = false;

		        //Update chat rooms message array with new message.
		        room.messages.push(message);
		        //While we're at it let's update the date as well.
		        room.lastMessageTimestamp = Date.now();
		        ChatroomStore(roomID, room);
		        console.log('Database: Message from ' + message.msgSender + ' added to room "' + roomID+'"');
	        }
	    }else{
	        //Store on the server.
 	    }
    };

    /**
     * addMessage adds a message to an existing chat room's message array.
     * @method addMessage
     */
    var addMessage  = function(roomID, message){
	    //Store locally
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

	        // var roomID = message.msgSender + '-' + message.msgReceiver;
	        var room = getChatroom(roomID);

	        console.log(roomID);
	        console.log(room);

	        //Check if chat room exists.
	        if(room != null){
		        //Update chat rooms message array with new message.
		        room.messages.push(message);

		        //While we're at it let's update the date as well.
		        // if(!message.self){
		        //     room.partnerName =  message.senderName;
		        // }
		        room.preview = message.msgBody.trunc(25, true);
		        try {
			        if (Chats.model["currentScreen"] == SCREENS.CHATROOM_PAGE && roomID == Chats.model.currentProfile + "-" + Chats.model.chatPartner) {
				        room.unreadMessageCount = 0;
			        } else {
				        room.unreadMessageCount++;
			        }
		        } catch (ex) {
			        if (DEBUG) console.log(ex);
			        room.unreadMessageCount = 0;
		        }
		        room.lastMessageTimestamp = Date.now();
		        ChatroomStore(roomID, room);
		        console.log('Database: Message from ' + message.msgSender + ' added to room "' + roomID+'"');
	        }
	    }else{
	        //Store on the server.
 	    }
    };

    /**
     * getMessagesFromRoom returns the messages stored in a single room.
     * @method getMessagesFromRoom
     */
    var getMessagesFromRoom  = function(roomID){
	    //Store locally
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

	        // var roomID = message.msgReceiver + '-' + message.msgSender;
	        var room = getChatroom(roomID);

	        //Check if chat room exists.
	        if(room != null){
		        return room.messages;
	        }else{
		        console.log('Error getting messages from room: Room was null.');
	        }
	    }else{
	        //Store on the server.
 	    }
    };

    var resetUnreadMessageCount = function(roomID) {
    	//Store locally
		if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

		    // var roomID = message.msgReceiver + '-' + message.msgSender;
		    var room = getChatroom(roomID);

		    //Check if chat room exists.
		    if(room != null){
		    	room.unreadMessageCount = 0;
				ChatroomStore(roomID, room);
		    }else{
			    console.log('Error getting messages from room: Room was null.');
		    }
		}else{
		    //Store on the server.
	 	}
    }

    /**
     * upsertFriends parses a array of friends and adds/updates them to the database.
     * it can accept a single record.
     * @method upsertFriends
     */
    var upsertFriends  = function(friendsArray){

	    // upsertFriends([
	    //     {
	    // 	uid : "85260736702",
	    // 	ref : "+852 6072354",
	    // 	jid : "boshtest1@chaatz.com",
	    // 	name : "Nick",
	    // 	status : "Lets Chat.",
	    // 	icon : "hjttp;?/",
	    // 	thumbnail : "htptt;>//",
	    // 	voice : "hjttp::?/",
	    // 	country : "HK"
	    //     },
	    //     {
	    // 	uid : "8521959125",
	    // 	ref : "+852 6072354",
	    // 	jid : "boshtest1@chaatz.com",
	    // 	name : "Mr Fake.",
	    // 	status : "Hey hey hey.",
	    // 	icon : "hjttp;?/",
	    // 	thumbnail : "htptt;>//",
	    // 	voice : "hjttp::?/",
	    // 	country : "HK"
	    //     }
	    // ]);

	    //Iterate through friends array
	    for(var i=0; i < friendsArray.length; i++){

	        //For each friend save their data in the appropriate storage.
	        if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	            FriendsStore(friendsArray[i].uid, {
	                uid : friendsArray[i].uid,
	                ref : friendsArray[i].ref,
	                jid : friendsArray[i].jid,
	                name : friendsArray[i].name,
	                status : friendsArray[i].status,
	                icon : friendsArray[i].icon,
		            thumbnail : friendsArray[i].thumbnail,
		            voice : friendsArray[i].voice,
		            country : friendsArray[i].country
	            });
	        }else{
		        //Store on the server
	        }
	    }
    };

    /**
     * upsertFriend adds a single friend to the database.
     * @method upsertFriend
     */
    var upsertFriend  = function(uid, friend){
	    FriendsStore(uid, friend);
    };

    /**
     * getAllFriends returns all friends in the database.
     * @method getAllFriends
     */
    var getAllFriends  = function(){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	        return FriendsStore.getAll();
	    }else{
	        //Serverside
	    }
    };

    /**
     * getAllChaatzNumberFriends return all friends beginning with * (CN Friends)
     * @method getAllChaatzNumberFriends
     */
    var getAllChaatzNumberFriends  = function(){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){

            var array = [];

            for (var key in FriendsStore.getAll()) {
                if(key.charAt(0) == '*'){
                    array.push(key);
                }
            }
	        return array;
	    }else{
	        //Serverside
	    }
    };

    var upsertContacts = function(contactsArray){
    	for(var i=0;i < contactsArray.length; i++) {
    		if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
    			ContactsStore(contactsArray[i].uid, {
    				name : contactsArray[i].name,
    				phone : contactsArray[i].phone,
    				uid : contactsArray[i].uid,
    				isChaatzUser : false
    			});
    		}else{
    			//Store on the server
    		}
    	}
    };

    var getNonChaatzUser = function(){
    	if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
    		var array = [];
    		$.each(ContactsStore.getAll(), function(key, value){
    			if(value.isChaatzUser == false) {
    				array.push(value);
    			}
    		});
    		return array;
    	}
    };

    var updateChaatzBoolean = function(uid, isChaatzUser){
    	if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
    		var value = ContactsStore.get(uid);
    		value.isChaatzUser = isChaatzUser;
    		ContactsStore(uid, value);
    	}
    };

    var isContactEmpty = function(){
    	if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
    		var bEmpty = true;
    		$.each(ContactsStore.getAll(), function(key, value){
    			bEmpty = false;
    			return false;
    		});
    	}
    	return bEmpty;
    };

    /**
     * getFriend returns a single friend by his unique id.
     * @method getFriend
     */
    var getFriend  = function(uid){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	        return FriendsStore.get(uid);
	    }else{
	        //Serverside
	    }
    };

    /**
     * removeFriend deletes a single friend by their uid from the DB.
     * @method removeFriend
     */
    var removeFriend  = function(uid){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	        FriendsStore.remove(uid);
	        console.log('Successfully removed friend.');
	    }else{
	        //Serverside
	    }
    };

    /**
     * removeAllFriends purges the friends table of all friends.
     * @method removeAllFriends
     */
    var removeAllFriends  = function(uid){
	    if(CONFIG.IS_LOCALSTORAGE_AVAILABLE){
	        FriendsStore.clear();
	        console.log('Successfully removed all friends.');
	    }else{
	        //Serverside
	    }
    };

    /**
     * upsertProfile adds the profile to the database if it doesn't exist,
     * and if it does just updates the existing record.
     * @method setObjectForKey
     */
    var setObjectForKey = function(key, value){
	    return MiscStore(key, value);
    };

    /**
     * upsertProfile adds the profile to the database if it doesn't exist,
     * and if it does just updates the existing record.
     * @method objectForKey
     */
    var objectForKey = function(key){
	    return MiscStore(key);
    };

    /**
     * Deletes every single database in Chaatz Lite. Goodbye
     * @method zaijian
     */
    var zaijian = function(key){
	    ProfileStore.clear();
	    FriendsStore.clear();
	    ChatroomStore.clear();
	    ChatStore.clear();
	    MiscStore.clear();
	    PostsStore.clear();
	    CommentsStore.clear();


	    console.log('Chaatz Lite: DB deleted.');
    };

	var savelikeForPost = function(topic_id, value){
		LikesStore.set( topic_id, value)
	};

	var getLikesForPosts = function(){
		return LikesStore.getAll()
	};
	var getLikesForPost = function(topic_id){
		return LikesStore.getAll()[topic_id];
	};

	

    /**
     *
     * @method removeChatroom
     */
    var removeChatroom = function(key){
        console.log('Removing key from ChatroomStore' + key);
        ChatroomStore.remove(key);
    }

    return {

	    //ProfileStore
	    createProfileWithoutIdentity : createProfileWithoutIdentity,
	    updateProfile : updateProfile,
	    getProfile : getProfile,
	    addIdentity : addIdentity,
	    getPhoneNumberIdentities : getPhoneNumberIdentities,
	    removeIdentity : removeIdentity,
	    removeAllProfiles : removeAllProfiles,
	    isAccountConfirmed : isAccountConfirmed,

	    //FriendsStore
	    upsertFriends : upsertFriends,
      upsertFriend : upsertFriend,
	    getAllFriends : getAllFriends,
	    getFriend : getFriend,
	    removeFriend: removeFriend,
	    removeAllFriends : removeAllFriends,

	    //ChatsStore
	    // upsertChats : upsertChats,
	    getAllChatrooms : getAllChatrooms,
	    getNonEmptyChatrooms : getNonEmptyChatrooms,
      getAllChaatzNumberFriends : getAllChaatzNumberFriends,
	    getChatroom : getChatroom,
	    updateChatroom : updateChatroom,
	    createChatroom : createChatroom,
      removeChatroom: removeChatroom,
	    createNewsroom : createNewsroom,
	    addMessage : addMessage,
	    getMessagesFromRoom : getMessagesFromRoom,
	    getAllChatroomsFromIdentity : getAllChatroomsFromIdentity,
	    deleteAllConversations : deleteAllConversations,
	    zaijian : zaijian,
	    resetUnreadMessageCount : resetUnreadMessageCount,

	    updateChaatzNumber : updateChaatzNumber,

	    //Return stores for DEBUG purposes ONLY, remove on Production.
	    ProfileStore : ProfileStore,

	    //Contacts store
  		upsertContacts : upsertContacts,
  		getNonChaatzUser : getNonChaatzUser,
  		updateChaatzBoolean : updateChaatzBoolean,
  		isContactEmpty : isContactEmpty,

	    //Keypair store
	    setObjectForKey : setObjectForKey,
	    objectForKey : objectForKey,
	    //Forum
	    savelikeForPost: savelikeForPost,
	    getLikesForPosts: getLikesForPosts,
	    getLikesForPost: getLikesForPost
    };

}());
