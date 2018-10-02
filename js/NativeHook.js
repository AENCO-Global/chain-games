/**
 * NativeHook contains interfaces to call native methods on different platforms
 *
 * @class NativeHook
 */

var NativeHook = (function() {

    /**
     * Determine whether the client is native app or browser
     * @method isNativeApp
     * @return{Boolean} Returns true in any native app while false on browser
     */
    function isNativeApp() {

	    if(typeof mInstance != "undefined" || isIosApp()){
	        return true;
	    }else{
	        return false;
	    }

	    // try {
	    //     // if(DEBUG) console.log("isNativeApp: " + mInstance);
	    //     return true;
	    // } catch (ex) {
	    //     // if(DEBUG) console.log("Not native app");
	    //     return false;
	    // }
    }

    function isIosApp() {
		if (navigator.platform.substr(0,2) === 'iP' && window.webkit.messageHandlers.ioshandler){
			//iOS (iPhone, iPod or iPad)
			return true;
		} else {
			return false;
		}
    }

    /**
     * Callback for captureWithCamera
     */
    var mCaptureWithCameraCb;
    /**
     * Start camera
     *
     * @method captureWithCamera
     */
    function captureWithCamera(uploadUrl, width, height) {
	    //mCaptureWithCameraCb = callback;
		if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.captureWithCameraCb", "uploadUrl":uploadUrl, "width":width, "height":height});
		} else {
			mInstance.captureWithCamera("NativeHook.captureWithCameraCb", uploadUrl, width, height);
		}
    }

    /*******************Post*****************/
    function captureWithCameraForPost(uploadUrl, width, height) {
	    //mCaptureWithCameraCb = callback;
		if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.captureWithCameraForPostCb", "uploadUrl":uploadUrl, "width":width, "height":height});
		} else {
			mInstance.captureWithCamera("NativeHook.captureWithCameraForPostCb", uploadUrl, width, height);
		}
    }    

    function captureWithCameraForPostCb(localpath)
    {
	    if(DEBUG) console.log("localpath:" + localpath);
	    //document.getElementById("demo").innerHTML += localpath;
	    //mCaptureWithCameraCb(localpath);
	    console.log(forumController);
	    forumController.postImageUploadCallback(localpath);
	    // Database.setObjectForKey("IMAGE_UPLOAD_RESULT", localpath);
    }

    function readImageFromAlbumForPost(uploadUrl, width, height) 
    {
	    //mReadImageFromAlbumCb = callback;
		if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.readImageFromAlbumForPostCb", "uploadUrl":uploadUrl, "width":width, "height":height});
		} else {
		    mInstance.readImageFromAlbum("NativeHook.readImageFromAlbumForPostCb", uploadUrl, width, height);
		}
    }

    function readImageFromAlbumForPostCb(localpath)
    {
	    if(DEBUG) console.log("localpath:" + localpath);
	    forumController.postImageUploadCallback(localpath);
    }
    /*******************Post*****************/

    /**
     * Callback of captureWithCamera.
     *
     * @method captureWithCameraCb
     * @param {String} full path of captured photo
     */
    function captureWithCameraCb(localpath)
    {
	    if(DEBUG) console.log("localpath:" + localpath);
	    //document.getElementById("demo").innerHTML += localpath;
	    //mCaptureWithCameraCb(localpath);

	    ProfileController.uploadImageCallback(localpath);
	    // Database.setObjectForKey("IMAGE_UPLOAD_RESULT", localpath);
    }

    /**
     * Callback for readImageFromAlbum
     */
    //var mReadImageFromAlbumCb;
    /**
     * Start Album
     *
     * @method readImageFromAlbum
     */
    function readImageFromAlbum(uploadUrl, width, height) {
	    //mReadImageFromAlbumCb = callback;
		if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.readImageFromAlbumCb", "uploadUrl":uploadUrl, "width":width, "height":height});
		} else {
		    mInstance.readImageFromAlbum("NativeHook.readImageFromAlbumCb", uploadUrl, width, height);
		}
    }

    /**
     * Callback of readImageFromAlbum.
     *
     * @method readImageFromAlbumCb
     * @param {String} full path of selected image
     */
    function readImageFromAlbumCb(localpath)
    {
	    if(DEBUG) console.log("localpath:" + localpath);
	    ProfileController.uploadImageCallback(localpath);
    }
    /**
     * Callback for getContactList
     */
    var mGetContactListCb;
    /**
     * Read contact list
     *
     * @method getContactList
     */
    function getContactList(callback) {
	    mGetContactListCb = callback;
	    	if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.getContactListCb"});
	    	} else {
			    mInstance.getContactList("NativeHook.getContactListCb");
			}
    }

    /**
     * Callback of getContactList.
     *
     * @method getContactListCb
     * @param {String} json of contact list
     */
    function getContactListCb(str) {
	    //document.getElementById("demo").innerHTML += "\r\n";
	    //document.getElementById("demo").innerHTML += str;
	    if(DEBUG) console.log("getContactListCb:" + str);
	    mGetContactListCb(str);
    }

    /*
     * Get device info
     *
     * @method getDeviceInfo
     */
    var mDeviceInfo = null;
    var mDeviceInfoCb;
    var getDeviceInfo = function(callback) {
	    mDeviceInfoCb = callback;
	    if (mDeviceInfo == null) {
			if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.getDeviceInfoCb"});
			} else {
				mInstance.getDeviceInfo("NativeHook.getDeviceInfoCb");
			}
	    } else {
	        getDeviceInfoCb(mDeviceInfo);
	    }
    };
    var getDeviceInfoCb = function(str) {
	    if(DEBUG) console.log("getDeviceInfoCb:" + str);
	    mDeviceInfoCb(str);
    };


    /**
     * Model for notifications
     */
    var options_vibrate = { "options": [
	    "Off",
	    "Default",
	    "Short",
	    "Long"
    ] };
    var options_popup = { "options": [
	    "No popup",
	    "Only when screen \"on\"",
	    "Only when screen \"off\"",
	    "Always show popup"
    ] };
    var options_light = { "options": [
	    "None",
	    "White",
	    "Red",
	    "Yellow",
	    "Green",
	    "Cyan",
	    "Blue",
	    "Purple"
    ] };

    var model_notifications_options = {
	    NotificationMessageVibrate : 0,
	    NotificationMessagePopup : 0,
	    NotificationMessageLight : 0,
	    NotificationChaatzConnectVibrate : 0,
	    NotificationChaatzConnectPopup : 0,
	    NotificationChaatzConnectLight : 0,
	    NotificationGroupVibrate : 0,
	    NotificationGroupPopup : 0,
	    NotificationGroupLight : 0
    };

    var refreshLayout = function() {
	    string_notifications_message["Value1"] = options_vibrate.options[model_notifications_options["NotificationMessageVibrate"]];
	    string_notifications_message["Description2"] = options_popup.options[model_notifications_options["NotificationMessagePopup"]];
	    string_notifications_message["Value3"] = options_light.options[model_notifications_options["NotificationMessageLight"]];
	    string_notifications_chaatz_connect["Value1"] = options_vibrate.options[model_notifications_options["NotificationChaatzConnectVibrate"]];
	    string_notifications_chaatz_connect["Description2"] = options_popup.options[model_notifications_options["NotificationChaatzConnectPopup"]];
	    string_notifications_chaatz_connect["Value3"] = options_light.options[model_notifications_options["NotificationChaatzConnectLight"]];
	    string_notifications_group["Value1"] = options_vibrate.options[model_notifications_options["NotificationGroupVibrate"]];
	    string_notifications_group["Description2"] = options_popup.options[model_notifications_options["NotificationGroupPopup"]];
	    string_notifications_group["Value3"] = options_light.options[model_notifications_options["NotificationGroupLight"]];
    };

    var setModel = function(key, value){
	    model_notifications_options[key] = value;
	    refreshLayout();
	    if (isNativeApp()) {
	        setSharedPreference(key, value);
	    }
    };

    var string_notifications_message = {
	    "className" : "classMessage",
	    "NotificationTitle" : "MESSAGE NOTIFICATIONS",
	    "Key1" : "Vibrate:",
	    "Value1" : options_vibrate.options[model_notifications_options["NotificationMessageVibrate"]],
	    "Description1" : "Vibrate device when new message is received.",
	    "Key2" : "Popup notification",
	    "Description2" : options_popup.options[model_notifications_options["NotificationMessagePopup"]],
	    "Key3" : "Light:",
	    "Value3" : options_light.options[model_notifications_options["NotificationMessageLight"]],
	    "Description3" : "Blink the device's notification light when new message is received."
    };
    var string_notifications_chaatz_connect = {
	    "className" : "classChaatzConnect",
	    "NotificationTitle" : "CHAATZ CONNECT NOTIFICATIONS",
	    "Key1" : "Vibrate:",
	    "Value1" : options_vibrate.options[model_notifications_options["NotificationChaatzConnectVibrate"]],
	    "Description1" : "Vibrate device when new message is received.",
	    "Key2" : "Popup notification",
	    "Description2" : options_popup.options[model_notifications_options["NotificationChaatzConnectPopup"]],
	    "Key3" : "Light:",
	    "Value3" : options_light.options[model_notifications_options["NotificationChaatzConnectLight"]],
	    "Description3" : "Blink the device's notification light when new message is received."
    };
    var string_notifications_group = {
	    "className" : "classGroup",
	    "NotificationTitle" : "GROUP NOTIFICATIONS",
	    "Key1" : "Vibrate:",
	    "Value1" : options_vibrate.options[model_notifications_options["NotificationGroupVibrate"]],
	    "Description1" : "Vibrate device when new message is received.",
	    "Key2" : "Popup notification",
	    "Description2" : options_popup.options[model_notifications_options["NotificationGroupPopup"]],
	    "Key3" : "Light:",
	    "Value3" : options_light.options[model_notifications_options["NotificationGroupLight"]],
	    "Description3" : "Blink the device's notification light when new message is received."
    };
    var string_feed = {
	    "GCM_ENABLE_LIKES" : "",
	    "GCM_ENABLE_COMMENTS" : "",
	    "GCM_ENABLE_POSTS" : "",
	    "GCM_ENABLE_FOLLOWS" : ""
    };
    var set_string_feed = function(key, value){
	    string_feed[key] = value;
	    if (isNativeApp()) {
	        setSharedPreference(key, value);
	    }
    };

    var mgetSharedPreferenceCb;
    function getSharedPreference(key, defaultValue, callback) {
	    if(DEBUG) console.log("getSharedPreference()");
	    mgetSharedPreferenceCb = callback;
	    if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.getSharedPreferenceCb", "key":key, "defaultValue":defaultValue});
	    } else {
		    mInstance.getSharedPreference(key, defaultValue, "NativeHook.getSharedPreferenceCb");
		}
    }

    function getSharedPreferenceCb(key, value) {
	    if(DEBUG) console.log("getSharedPreferenceCb(): " + key + " " + value);
	    mgetSharedPreferenceCb(key, value);
	    refreshLayout();
    }

    function getSharedPreferenceNew(key, defaultValue) {
	    if(DEBUG) console.log("getSharedPreferenceNew()");
	    var promise = $.Deferred();
	    mHookCount++;
	    mHookId2Promise[mHookCount] = promise;

	    if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.getSharedPreferenceCbNew", "key":key, "defaultValue":defaultValue});
	    } else {
	    	try {
		    	mInstance.getSharedPreferenceNew(key, defaultValue, mHookCount, "NativeHook.getSharedPreferenceCbNew");
			} catch (ex) {
				promise.reject();
				return promise;
			}
		}
		return promise;
    }
    function getSharedPreferenceCbNew(key, value, hookId) {
	    if(DEBUG) console.log("getSharedPreferenceCbNew(): " + key + " " + value);	    
	    mHookId2Promise[hookId].resolve(key, value);
    }

    function getBooleanSharedPreference(key, defaultValue) {
	    if(DEBUG) console.log("getBooleanSharedPreference()");
	    var promise = $.Deferred();
	    mHookCount++;
	    mHookId2Promise[mHookCount] = promise;

	    if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.getBooleanSharedPreferenceCb", "key":key, "defaultValue":defaultValue});
	    } else {
	    	try {
		    	mInstance.getBooleanSharedPreference(key, defaultValue, mHookCount, "NativeHook.getBooleanSharedPreferenceCb");
			} catch (ex) {
				promise.reject();
				console.log("Error: " + ex);
				return promise;
			}
		}
		return promise;
    }
    function getBooleanSharedPreferenceCb(key, value, hookId) {
	    if(DEBUG) console.log("getBooleanSharedPreferenceCb(): " + key + " " + value);	 
	    if(DEBUG) console.log("getBooleanSharedPreferenceCb(): " + hookId);	   
	    mHookId2Promise[hookId].resolve(key, value);
    }

    function setSharedPreference(key, value) {
	    if(DEBUG) console.log("setSharedPreference()");
	    if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"setSharedPreference", "key":key, "value":value});
	    } else {
		    mInstance.setSharedPreference(key, value);
		}
    }

    function init() {
	    if (isNativeApp()) {
	        // Read shared prefs from Native
	        getSharedPreference("NotificationMessageVibrate", 1, function(key, value){
		        model_notifications_options[key] = value;
	        });
	        getSharedPreference("NotificationMessagePopup", 2, function(key, value){
		        model_notifications_options[key] = value;
	        });
	        getSharedPreference("NotificationMessageLight", 0, function(key, value){
		        model_notifications_options[key] = value;
	        });
	        getSharedPreference("NotificationChaatzConnectVibrate", 1, function(key, value){
		        model_notifications_options[key] = value;
	        });
	        getSharedPreference("NotificationChaatzConnectPopup", 2, function(key, value){
		        model_notifications_options[key] = value;
	        });
	        getSharedPreference("NotificationChaatzConnectLight", 0, function(key, value){
		        model_notifications_options[key] = value;
	        });
	        getSharedPreference("NotificationGroupVibrate", 1, function(key, value){
		        model_notifications_options[key] = value;
	        });
	        getSharedPreference("NotificationGroupPopup", 2, function(key, value){
		        model_notifications_options[key] = value;
	        });
	        getSharedPreference("NotificationGroupLight", 0, function(key, value){
		        model_notifications_options[key] = value;
	        });
	        getSharedPreference("GCM_ENABLE_LIKES", "checked", function(key, value){
		        string_feed[key] = value;
	        });
	        getSharedPreference("GCM_ENABLE_COMMENTS", "checked", function(key, value){
		        string_feed[key] = value;
	        });
	        getSharedPreference("GCM_ENABLE_POSTS", "checked", function(key, value){
		        string_feed[key] = value;
	        });
	        getSharedPreference("GCM_ENABLE_FOLLOWS", "checked", function(key, value){
		        string_feed[key] = value;
	        });

	        refreshLayout();
	    }
    };

    var onConnectionChanged = function(reason) {
	    if(DEBUG) console.log("onConnectionChanged:" + reason);
	    NetworkManager.postNetworkChangeEvent(reason);
    }

    var mPromiseSms;
    var sendSmsMessage = function(number, messageBody) {
		mPromiseSms = $.Deferred();
	    if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.sendSmsMessageCb", "number":number, "messageBody":messageBody});
		} else {
			mInstance.sendSmsMessage(number, messageBody, "NativeHook.sendSmsMessageCb");
		}
    	return mPromiseSms;
    };
    var sendSmsMessageCb = function(value) {
    	if (DEBUG) console.log("sendSmsMessageCb:");
    	if (DEBUG) console.log(value);
    	mPromiseSms.resolve(value);
    };

    var mHookCount = 0;
    var mHookId2Promise = {};
    var makeURLRequest = function(strUrl, method, isHttps, body) {
	    var promise = $.Deferred();
	    mHookCount++;
	    mHookId2Promise[mHookCount] = promise;
	    if (DEBUG) console.log("hookId:" + mHookCount);
	    if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.onURLRequestCb", "mHookCount":mHookCount, "strUrl":strUrl, "httpMethod":method, "isHttps":isHttps, "body":body});
		} else {
		    mInstance.makeURLRequest("NativeHook.onURLRequestCb", mHookCount, strUrl, method, isHttps, body);
		}
	    return promise;
    }

    var onURLRequestCb = function(hookId, response) {
	    if (DEBUG) console.log("response:" + response);
	    if (DEBUG) console.log("hookId:" + hookId);
	    mHookId2Promise[hookId].resolve(response);
    }

    /*
     * Get network status
     *
     * @method getNetworkStatus
     */
    var getNetworkStatus = function() {
	    var promise = $.Deferred();
	    mHookCount++;
	    mHookId2Promise[mHookCount] = promise;
	    if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.getNetworkStatusCb", "hookId":mHookCount});
	    } else {
		    mInstance.getNetworkStatus("NativeHook.getNetworkStatusCb", mHookCount);
		}
	    return promise;
    };
    var getNetworkStatusCb = function(hookId, str) {
	    mHookId2Promise[hookId].resolve(str);
    };

    var sendGCMToken = function() {
    	getSharedPreference("gcm_token", "", function(key, value){
    		if(DEBUG) console.log(key + ": " + value);
    		ChaatzPlugin.sendGCMToken(value).then(
	            function(response) {
	                console.log("gcm_token: " + response);
	           	}
	        );
    	});
    }

    var onBackPressed = function() {
    	if (DEBUG) console.log("onBackPressed");



    	//chaatzAlert.notify("Back button pressed!", "error");
    	try {
	        CONFIG.CURRENT_MODULE.onBackPressed();
    		// ChatsController.onBackPressed();
    	} catch (ex) {}
    	try {
    		// SettingsController.onBackPressed();
    	} catch (ex) {}
    }

    var mPromisePopup;
    var showPopupDialog = function(title, body, btnLeft, btnRight) {
    	mPromisePopup = $.Deferred();
		if (isIosApp()) {
			window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.onPopupClick", "title":title, "body":body, "btnLeft":btnLeft, "btnRight":btnRight});
		} else {
	    	mInstance.showPopupDialog(title, body, btnLeft, btnRight, "NativeHook.onPopupClick");
	    }
    	return mPromisePopup;
    }

    var onPopupClick = function(value) {
    	if (DEBUG) console.log("onPopupClick:");
    	if (DEBUG) console.log(value);
    	mPromisePopup.resolve(value);
    }

    var showPopupDialogOneButton = function(title, body, btnCenter) {
        if(!isNativeApp()){
            alert(title + ":" + body);
            return null;
        }else{
			if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"showPopupDialogOneButton", "title":title, "body":body, "btnCenter":btnCenter});
			} else {
	            mInstance.showPopupDialogOneButton(title, body, btnCenter);
	        }
        }

    }

    var showToast = function(body) {
        if(!isNativeApp()){
            console.log(body);
            return null;
        }else{
            mInstance.showToast(body);
        }

    }

    var exitApp = function() {
    	try {
    		mInstance.exitApp();
    	} catch (ex) {}
    }

    var registerSmsReceiver = function() {
    	try {
    		mInstance.registerSmsReceiver();
    	} catch (ex) {}
    }
    var unregisterSmsReceiver = function() {
    	try {
    		mInstance.unregisterSmsReceiver();
    	} catch (ex) {}
    }
    var onSmsRecieved = function(sender, code) {
    	try {
    	    if (DEBUG) console.log("sender:" + sender);
    	    if (DEBUG) console.log("code:" + code);
    	    EnterActivationCodeController.verifyActivationCode(code);
    	} catch (ex) {}
    }

    var clearCache = function() {
    	try {
			if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"clearWebviewCache"});
			} else {
	    		mInstance.clearWebviewCache();
	    	}
    	} catch (ex) {}
    }

    var mOnRecordCb;
    var startRecording = function(uploadUrl, callback) {    	
    	try {
    		mOnRecordCb = callback;
			if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.onRecord", "uploadUrl":uploadUrl});
			} else {
	    		mInstance.startRecording("NativeHook.onRecord", uploadUrl);
	    	}
		} catch (ex) {}
    };

    var stopRecording = function(){    	
    	try {
			if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"stopRecording"});
			} else {
	    		mInstance.stopRecording();
	    	}
		} catch (ex) {}
    }

    var cancelRecording = function(){    	
    	try {
			if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"cancelRecording"});
			} else {
	    		mInstance.cancelRecording();
	    	}
		} catch (ex) {}
    }

    /*
     * Callback of recording
     *
     * @method onRecord
     * @param state         - record state
     * @param recordTime    - record time in second
     * @param path          - url to uploaded file
     * @param filesize      - size of recorded file
     */
    var onRecord = function(state, recordTime, path, filesize) {
        if (mOnRecordCb) {
    	   mOnRecordCb(state, recordTime, path, filesize);
        }
    };

    var mOnPlayCb;
    var startPlaying = function(downloadUrl, callback) {    
        try {
            mOnPlayCb = callback;
			if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"NativeHook.onPlay", "downloadUrl":downloadUrl});
			} else {
	            mInstance.startPlaying("NativeHook.onPlay", downloadUrl);
	        }
        } catch (ex) {}
    }
    var stopPlaying = function(){     
        try {
			if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"stopPlaying"});
			} else {
	            mInstance.stopPlaying();
	        }
        } catch (ex) {}
    }

    /*
     * Callback of playing
     *
     * @method onPlay
     * @param state         - play state
     * @param recordTime    - play time in second
     * @param length        - total length of audio
     */
    var onPlay = function(state, playTime, length) {
        if (mOnPlayCb) {
            mOnPlayCb(state, playTime, length);
        }
    };

    // Show dat sweet toast
    var showToast = function(message) {
        try {
            mInstance.showToast(message);
        } catch (ex) {}
    }

    /*
     * Send game message 
	 *
	 * @method sendGameMessage
	 * @param gameId	- game id
	 * @param type		- 'invite'/'accept'/'move'/'quit'
	 * @param message 	- nil/nil/message body/nil
     */
    var sendGameMessage = function(gameId, type, message) {
    	if (DEBUG) console.log("sendGameMessage")
        try {
			if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"sendGameMessage", "type":type, "message":message});
			} else {
	        }
        } catch (ex) {}
    };

    var mGameMessageReceiver;
    var setGameMessageReceiver = function(callback){
    	mGameMessageReceiver = callback;
    }
    /*
     * Callback when receive game message from opponent
	 *
	 * @method sendGameMessage
	 * @param gameId	- game id
	 * @param type		- 'invite'/'accept'/'move'/'quit'
	 * @param message 	- nil/nil/message body/nil
     */
    var onReceiveGameMessage = function(gameId, type, message) {
    	if (DEBUG) console.log("onReceiveGameMessage");
    	if (mGameMessageReceiver){
    		mGameMessageReceiver(gameId, type, message);
    	}
    };

    /*
     * Report game result
	 *
	 * @method reportGameResult
	 * @param gameId	- game id
	 * @param result	- result in json
     */
    var reportGameResult = function(gameId, result) {
    	if (DEBUG) console.log("reportGameResult")
        try {
			if (isIosApp()) {
				window.webkit.messageHandlers.ioshandler.postMessage({"method":"reportGameResult", "result":result});
			} else {
	        }
        } catch (ex) {}
    }

    return {
	    init : init,
	    isNativeApp : isNativeApp,
	    isIosApp : isIosApp,
	    captureWithCamera : captureWithCamera,
	    captureWithCameraCb : captureWithCameraCb,
	    captureWithCameraForPost : captureWithCameraForPost,
	    captureWithCameraForPostCb : captureWithCameraForPostCb,
	    readImageFromAlbum : readImageFromAlbum,
	    readImageFromAlbumCb : readImageFromAlbumCb,
	    readImageFromAlbumForPost: readImageFromAlbumForPost,
	    readImageFromAlbumForPostCb: readImageFromAlbumForPostCb,
	    getContactList : getContactList,
	    getContactListCb : getContactListCb,
	    getSharedPreference : getSharedPreference,
	    getSharedPreferenceCb : getSharedPreferenceCb,
	    getSharedPreferenceNew : getSharedPreferenceNew,
	    getSharedPreferenceCbNew : getSharedPreferenceCbNew,
	    getBooleanSharedPreference : getBooleanSharedPreference,
	    getBooleanSharedPreferenceCb : getBooleanSharedPreferenceCb,
	    setSharedPreference : setSharedPreference,
	    string_notifications_message : string_notifications_message,
	    string_notifications_chaatz_connect : string_notifications_chaatz_connect,
	    string_notifications_group : string_notifications_group,
	    string_feed : string_feed,
	    set_string_feed : set_string_feed,
	    options_vibrate : options_vibrate,
	    options_popup : options_popup,
	    options_light : options_light,
	    setModel : setModel,
	    getDeviceInfo : getDeviceInfo,
	    getDeviceInfoCb : getDeviceInfoCb,
	    getNetworkStatus : getNetworkStatus,
	    getNetworkStatusCb : getNetworkStatusCb,
	    onConnectionChanged : onConnectionChanged,
	    sendSmsMessage : sendSmsMessage,
	    sendSmsMessageCb : sendSmsMessageCb,
	    makeURLRequest : makeURLRequest,
	    onURLRequestCb : onURLRequestCb,
	    sendGCMToken : sendGCMToken,
	    onBackPressed : onBackPressed,
	    showPopupDialog : showPopupDialog,
	    onPopupClick : onPopupClick,
	    exitApp : exitApp,
	    showPopupDialogOneButton : showPopupDialogOneButton,
      showToast : showToast,
	    registerSmsReceiver : registerSmsReceiver,
	    unregisterSmsReceiver : unregisterSmsReceiver,
	    onSmsRecieved : onSmsRecieved,
	    clearCache : clearCache,
	    startRecording : startRecording,
	    stopRecording : stopRecording,
	    cancelRecording : cancelRecording,
	    onRecord : onRecord,
        startPlaying : startPlaying,
        stopPlaying : stopPlaying,
        onPlay : onPlay,
        showToast : showToast,
        sendGameMessage : sendGameMessage,
        onReceiveGameMessage : onReceiveGameMessage,
        setGameMessageReceiver : setGameMessageReceiver,
        reportGameResult : reportGameResult
    }

}());
