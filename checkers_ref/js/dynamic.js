var g_time = 35;
var g_time_delay = 0;
var g_time_start = -10;
var g_continueIn = "";
var g_timerEnabled = true;
var g_timerTimeout = 0;
var g_adSenseForGamesDisplayed = false;
var g_decreaseCounterQueueTime = undefined;
var g_gameNameCache = null;

function setTimeLimit(n) {
    g_time = n;
}

function decreaseCounter(sTime) {
    if (g_adSenseForGamesDisplayed) {
        g_decreaseCounterQueueTime = sTime;
    }
    else {
        if (sTime == "" || sTime == null) { sTime = "Time: "; }

        if (document.getElementById)
        {
            if (--g_time > 0)
            {
                var elm = document.getElementById("counter");
                if (elm)
                {
                    if (g_time_start == -10) { g_time_start = g_time; }
                    adjustBar(g_time_start, g_time);
                    elm.innerHTML = sTime + g_time;
                    if (g_timerEnabled) {
                        g_timerTimeout = setTimeout('decreaseCounter("' + sTime + '")', 1000);
                    }
                }
            }
            else
            {
                document.mainForm.submit();
            }
        }
    }
}

function adjustBar(max, n) {
    p = getPercentage(max, n);
    var elm = document.getElementById("counterbar");
    elm.style.width = p + "px";
    elm.style.backgroundColor = "rgb(" + Math.round( (100 - p)  * 2.45 ) + ",120,100)";
}

function getPercentage(max, n) {
    p = 0;

    if (max > 0 && n > 0) {
        if (n > max)  {
            p = 100;
        }
        else if (n < 0) {
            p = 0;
        }
        else {
            p =  Math.round( (n / max) * 100 );
        }
    }

    return p;
}

function focusInput() {
    document.mainForm.guess.focus();
}

function delayContinue(timeDelay, sContinueIn) {
    if (sContinueIn == "" || sContinueIn == null) {
        sContinueIn = "Continue in [number] seconds...";
    }

    if (g_continueIn == "") {
        g_continueIn = sContinueIn;
    }

    if (document.getElementById)
    {
        if (timeDelay != 0)
        {
            var elm = document.getElementById("continueButton");
            elm.style.display = "none";
            g_time_delay = timeDelay;
        }

        if (--g_time_delay > 0)
        {
            var elm = document.getElementById("continueDelay");
            if (elm) {
                elm.innerHTML = g_continueIn.replace(/\[number\]/, g_time_delay);
                setTimeout('delayContinue(0, "")', 1000);
            }
        }
        else
        {
            var elm = document.getElementById("continueDelay");
            elm.style.display = "none";

            elm = document.getElementById("continueButton");
            if (elm)
            {
                elm.style.display = "block";
                focusContinue();
            }
        }

    }
}

function focusContinue() {
    document.mainForm.continueButton.focus();
}

function toggleEnglishWordGames() {
    var elmGames = document.getElementById("englishWordGames");
    var elmFooter = document.getElementById("footer");
    var elmHome = document.getElementById("home");

    if (elmGames.style.display != "block") {
        elmGames.style.display = "block";
        elmFooter.style.top = (elmHome) ? "70px" : "150px";
    }
    else {
        elmGames.style.display = "none";
        elmFooter.style.top = (elmHome) ? "40px" : "125px";
    }
}

function misc_toggleElm(id) {
    var elm = document.getElementById(id);
    if (elm) {
        elm.style.display = (elm.style.display != "block") ? "block" : "none";
    }
}

function misc_toggleTimer() {
    g_timerEnabled = !g_timerEnabled;
    var elm = document.getElementById("counterbar");
    if (g_timerEnabled) {
        g_timerTimeout = setTimeout( 'decreaseCounter()', 100 );
        elm.title = "Pause timer";
    }
    else {
        clearTimeout(g_timerTimeout);
        g_timerTimeout = 0;
        var elm = document.getElementById("counterbar");
        elm.style.backgroundColor = "rgb(0,198,163)";
        elm.title = "Continue timer";
    }
}

function getAdvertisementGoogleAdSenseForGames() {
    var html = '';

    if (sessionStorage.skipNextAdSenseForGames) {
        delete sessionStorage.skipNextAdSenseForGames;
        return html;
    }

    g_adSenseForGamesDisplayed = true;
    
    var adType = 'text_image_flash_skippablevideo';

    var width = 700;
    var height = 650;
    var isRunningLocally = false;
    var adTestParam = isRunningLocally ? '%26adtest%3Don' : '';
    
    html += '<div id="adsenseForGames">';
    html += "" +
        "    <object \r" +
        "        classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" \r" +
        "        codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0\" \r" +
        "        width=\"" + width + "\" height=\"" + height + "\" \r" +
        "        id=\"preloader\" \r" +
        "        align=\"middle\">\r" +
        "        <param name=\"allowScriptAccess\" value=\"always\" />\r" +
        "        <param name=\"allowFullScreen\" value=\"false\" />\r" +
        "        <param name=\"movie\" value=\"/lib/ima3_preloader_1.5.swf\" />\r" +
        "        <param name=\"quality\" value=\"high\" />\r" +
        "        <param name=\"bgcolor\" value=\"#FFFFFF\" />\r" +
        "        <param name=\"flashvars\" value=\"adTagUrl=http%3A%2F%2Fgoogleads.g.doubleclick.net%2Fpagead%2Fads%3Fad_type%3D" + adType + "%26" +
        "client%3Dca-games-pub-4135663670627621%26videoad_start_delay%3D0%26description_url%3D" +
        "http%253A%252F%252Fgamesforthebrain.com%2Finfo%26max_ad_duration%3D120000%26hl%3Den" + adTestParam + "\">\r" +
        "\r" +
        "        <embed src=\"/lib/ima3_preloader_1.5.swf\"\r" +
        "            quality=\"high\" bgcolor=\"#FFFFFF\"\r" +
        "            width=\"" + width + "\" height=\"" + height + "\"\r" +
        "            name=\"preloader\"\r" +
        "            align=\"middle\" allowScriptAccess=\"always\"\r" +
        "            allowFullScreen=\"false\"\r" +
        "            type=\"application/x-shockwave-flash\"\r" +
        "            flashVars=\"adTagUrl=http%3A%2F%2Fgoogleads.g.doubleclick.net%2Fpagead%2Fads%3Fad_type%3D" + adType + "%26\r" +
        "client%3Dca-games-pub-4135663670627621%26videoad_start_delay%3D0%26description_url%3" +
        "Dhttp%253A%252F%252Fgamesforthebrain.com%2Finfo%26max_ad_duration%3D120000%26hl%3Den" + adTestParam + "\"\r" +
        "            pluginspage=\"http://www.adobe.com/go/getflashplayer\" />\r" +
        "\r" +
        "        </object>\r";
    html += '</div>';

    return html;
}

function removeAdSwf() {
    g_adSenseForGamesDisplayed = false;
    var elm = document.getElementById('adsenseForGames');
    if (elm) { elm.style.display = 'none' };
    if (g_decreaseCounterQueueTime !== undefined) {
        decreaseCounter(g_decreaseCounterQueueTime);
        g_decreaseCounterQueueTime = null;
    }
}

function noAdsReturned() {
    removeAdSwf();
}

function addAllIdIfMissing() {
    var elems = document.getElementsByTagName('*'), i;
    for (i in elems) {
        if( (' ' + elems[i].className + ' ').indexOf(' all ') >= 0 ) {
            elems[i].id = 'all';
            break;
        }
    }
}

function offerAdStyleChoice() {
    if (localStorage) {
        var elm = document.getElementById('adChoice');
        if (elm) {
            elm.innerHTML =
                    '<a href="javascript:setPrefersNonAnimatedAds(false)" class="adStyleChoiceLink">Animated</a> | ' +
                    '<a href="javascript:setPrefersNonAnimatedAds(true)" class="adStyleChoiceLink">Non-Animated</a> | ' +
                    '<a href="javascript:hideAdChoice()" class="adStyleChoiceLink">[close]</a>';
        }
    }
}

function hideAdChoice() {
    var elm = document.getElementById('adChoice');
    elm.innerHTML = getAdChoiceHtml();
}

function getAdChoiceHtml() {
    return '<a href="javascript:offerAdStyleChoice()">ad style</a>';
}

function setPrefersNonAnimatedAds(prefersNonAnimatedAds) {
    var oldUserPrefersNonAnimatedAds = localStorage.userPrefersNonAnimatedAds;
        
    if (prefersNonAnimatedAds) {
        localStorage.userPrefersNonAnimatedAds = true;
        localStorage.userPreferenceDate = new Date();
    }
    else {
        delete localStorage.userPrefersNonAnimatedAds;
    }

    if (oldUserPrefersNonAnimatedAds == localStorage.userPrefersNonAnimatedAds) {
        alert('Preference kept, thanks!');
        hideAdChoice();
    }
    else if ( confirm('Preference set, thanks! Please reload the page.') ) {
        sessionStorage.skipNextAdSenseForGames = true;
        location.reload();
    }
}

function getAdBannerRectangle(gameName) {
    var contentWidth = 1250;
    var distanceToAd = 150;
    var rightEdgeOfContent = window.innerWidth / 2 - contentWidth / 2 + 700 + 25 + 75;
    if (window.innerWidth < contentWidth) { rightEdgeOfContent = 780; }
    
    var minMarginToRightEdge = 10;
    if (window.innerWidth <= 1366) { minMarginToRightEdge = 5; }
    else if (window.innerWidth >= 1900) { minMarginToRightEdge = 15; }

    var contentPaddingRight = 54;
    var alwaysLeftAlign = true;

    if (window.innerWidth <= contentWidth || alwaysLeftAlign) {
        switch (gameName) {
            case 'freecell':
                contentPaddingRight = 2;
                break;

            case 'lettermaze':
                contentPaddingRight = 127;
                break;
                
            case 'crimescene':
                contentPaddingRight = 106;
                break;
                
            case 'counterfeit':
                contentPaddingRight = 58;
                break;
                
            case 'mastercards':
                contentPaddingRight = 64;
                break;
                
            case 'dragger':
                contentPaddingRight = 143;
                break;
                
            case 'newpolis':
            case 'manyland':
                contentPaddingRight = 17;
                break;
                
            case 'colorlines':
            case 'guesscolors':
            case 'chinesecheckers':
            case 'sudoku':
            case 'reversi':
            case 'mastermind':
            case 'twincol':
            case 'numberhunt':
            case 'minehunter':
            case 'mahjongg':
            case 'whatwasthere':
            case 'imagequiz':
            case 'trivia':
            case 'marsmoney':
            case 'memocoly':
            case 'checkers':
            case 'chess':
            case 'anagramania':
            case 'guessplace':
            case 'googleadventure':
            case 'letterama':
            case 'squarewords':
            case 'whatword':
            case 'spellice':
            case 'whatsearch':
            case 'wordhunt':
            case 'speedtype':
            case 'speedread':
                contentPaddingRight = 320;
                break;
        }
    }
    
    var x = Math.floor(rightEdgeOfContent - contentPaddingRight + distanceToAd);
    if (x < rightEdgeOfContent + minMarginToRightEdge) {
        x = rightEdgeOfContent + minMarginToRightEdge;
    }
    
    var possibleScrollbarWidth = 20;
    var width = (window.innerWidth - possibleScrollbarWidth) - x;
    var adWidthMax = 300;
    var adHeightMax = 600;
    if (width > adWidthMax) { width = adWidthMax; }
    else if (width <= 0) { width = 1; }
    
    var minY = 35;
    var maxY = 75;
    var y = window.innerHeight - adHeightMax - 5;
    y = limit(y, minY, maxY);
    
    return {x: x, y: y, width: width, height: adHeightMax};
}

function positionContentAndBanner(gameName) {
    if (typeof gameName === 'string') { g_gameNameCache = gameName; }
    else if (g_gameNameCache) { gameName = g_gameNameCache; }

    var rect = getAdBannerRectangle(gameName);

    var bannerElm = document.getElementById('adSenseSideBanner');
    if (bannerElm) {
        bannerElm.style.left = rect.x + 'px';
        bannerElm.style.top = rect.y + 'px';
        bannerElm.style.width = rect.width + 'px';
        bannerElm.style.height = rect.height + 'px';
    }
}

function limit(v, min, max) {
    return Math.min( max, Math.max(min, v) );
}

var ajax = {};
ajax.x = function() {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();  
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",   
        "MSXML2.XmlHttp.4.0",  
        "MSXML2.XmlHttp.3.0",   
        "MSXML2.XmlHttp.2.0",  
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for(var i = 0; i < versions.length; i++) {  
        try {  
            xhr = new ActiveXObject(versions[i]);  
            break;  
        } catch (e) {
        }  
    }
    return xhr;
};

ajax.send = function(url, callback, method, data, sync) {
    var x = ajax.x();
    x.open(method, url, sync);
    x.onreadystatechange = function() {
        if (x.readyState == 4) {
            if (callback) { callback(x.responseText); }
        }
    };
    x.send(data)
};

ajax.get = function(url, data, callback, sync) {
    var query = [];
    for (var key in data) {
        query.push( encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) );
    }
    ajax.send( url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, sync );
};

if (sessionStorage && window.innerWidth) {
    if (sessionStorage.savedInnerWidth && sessionStorage.savedInnerWidth != window.innerWidth) {
        delete sessionStorage.savedInnerWidth;
    }

    if (!sessionStorage.savedInnerWidth) {
        sessionStorage.savedInnerWidth = window.innerWidth;
        var data = {innerWidth: window.innerWidth, innerHeight: window.innerHeight};
        ajax.get('/lib/save_browser_size.php5', data, null, 'GET');
    }
}