var timer;
var closeboxtimer;
var probableAdError = false;
var didWeHideV = false;
var AppPrizes_jQuery;
var invokeVideoAd = null;
var APXcounter = 0;
var duration = 30;
var show = new Boolean();
var didVideoComplete = false;
var ACTIVE_PLAYLIST_INDEX = 0;
var AppPrizesTimer;
var defaultDuration = 30;
var tag = "http://" + openxApiHost + openxApiPath + zoneID;
loadScript(assetHostAndPath + "/jquery.js", function () {
    jQuery(function () {
        if (show) {
            if (ShowAdOnPageload) {
                if (AutoplayMuted) doPopAd('', '', '', '', true, 'top');
                else doPopAd();
            }
        }
    });
    AppPrizes_jQuery = jQuery.noConflict(false);
    if (getCookie("AppPrizes") == 'video_ad') {
        show = false;
    } else {
        var date = new Date();
        date.setTime(date.getTime() + (document.AppPrizes_ad_interval * 60 * 1000));
        setCookie("AppPrizes", "video_ad", date);
    }
    APXcounter++;
    loadScript(assetHostAndPath + "/jquery-ui.js", function () {
        APXcounter++;
        setFunctionifAllLoaded();
    });
    loadScript(assetHostAndPath + "/player/live/jwplayer.min.js", function () {
        APXcounter++;
        setFunctionifAllLoaded();
    });
    if (!nocss) {
        AppPrizes_jQuery("<link>").attr({
            "href": "\/\/ajax.googleapis.com\/ajax\/libs\/jqueryui\/1.10.2\/themes\/le-frog\/jquery-ui.css",
            "rel": "stylesheet"
        }).appendTo("head");
    }
});
if (typeof AppPrizes_image != 'undefined') {
    document.AppPrizes_image = AppPrizes_image;
} else {
    document.AppPrizes_image = getHoldscreen;
}
if (typeof AppPrizes_ad_interval != 'undefined') {
    document.AppPrizes_ad_interval = AppPrizes_ad_interval;
} else {
    document.AppPrizes_ad_interval = DefaultAdInterval;
}
if (typeof AppPrizes_AutoPlay != 'undefined') {
    document.AppPrizes_AutoPlay = AppPrizes_AutoPlay;
} else {
    document.AppPrizes_AutoPlay = Autoplay;
}
function onBackupBanner() {
    var targetURL = "//" + openxApiHost + "/openx/www/delivery/afr.php?zoneid=" + fallbackZoneID + "&cb=" + Math.floor(Math.random() * 999999);
    AppPrizes_jQuery('#appprizes-backup').html("<iframe width=300 height=250 src='" + targetURL + "'></iframe>");
    AppPrizes_jQuery('#appprizes-backup').show();
};
var PLAYLISTS = [
    [
        {
            "file": "https:" + assetHostAndPath + "/player/live/blank15.mp4",
            "title": "15s Banner Backdrop",
            "duration": 15
        },
        {
            "file": "https:" + assetHostAndPath + "/player/live/blank10.mp4",
            "title": "10s Banner Backdrop",
            "duration": 10
        }
    ]
];
function createUserOVAConfig(adPosition) {
    if (ApplixirParameterUserID) {
        tag += "&userid=" + ApplixirParameterUserID;
    }
    if (ApplixirParameterGameID) {
        tag += "&gameid=" + ApplixirParameterGameID;
    }
    if (ApplixirParameterOptional) {
        tag += "&optional=" + ApplixirParameterOptional;
    }
    var config = {
        "autoPlay": true,
        "controlbar": false,
        "debug": {"levels": "none"},
        "ads": {
            "schedule": [
                {
                    "position": adPosition,
                    "tag": tag
                }
            ]
        }
    };
    return config;
}
function createOVAConfig(adPosition) {
    var config = {
        "autoPlay": true,
        "controlbar": false,
        "debug": {"levels": "none"},
        "ads": {
            "servers": [
                {
                    "type": "OpenX",
                    "apiAddress": "https:" + assetHostAndPath + "/player/banner15.xml"
                }
            ],
            "notice": {"textStyle": "smalltext"},
            "schedule": [
                {
                    "zone": "18",
                    "position": adPosition
                }
            ]
        }
    };
    return config;
}
function rescheduleWithAdPosition(position) {
    if ((typeof jwplayer("ApplixirPlayer") !== 'undefined') && (jwplayer("ApplixirPlayer") != null)) {
        if (jwplayer("ApplixirPlayer").getPlugin("ova").scheduleAds(PLAYLISTS[ACTIVE_PLAYLIST_INDEX], createOVAConfig(position))) {
            ACTIVE_PLAYLIST_INDEX = ((ACTIVE_PLAYLIST_INDEX == 0) ? 1 : 0);
        }
    }
}
function rescheduleWithUIDAdPosition(position) {
    if (ApplixirParameterUserID) {
        tag += "&userid=" + ApplixirParameterUserID;
    }
    if (ApplixirParameterGameID) {
        tag += "&gameid=" + ApplixirParameterGameID;
    }
    if (ApplixirParameterOptional) {
        tag += "&optional=" + ApplixirParameterOptional;
    }
    if ((typeof jwplayer("ApplixirPlayer") !== 'undefined') && (jwplayer("ApplixirPlayer") != null)) {
        if (jwplayer("ApplixirPlayer").getPlugin("ova").scheduleAds(PLAYLISTS[ACTIVE_PLAYLIST_INDEX], createUserOVAConfig(position))) {
            ACTIVE_PLAYLIST_INDEX = ((ACTIVE_PLAYLIST_INDEX == 0) ? 1 : 0);
        }
    }
}
function onAdSchedulingComplete(ads) {
    if (ads.length > 0) {
        // Proceed with playback
    } else {
        // We have no ads to play
        rescheduleWithAdPosition('pre-roll');
    }
}
function doPopAd(title, messagetext, progresstext, autoplay, muted, vposition, dpacallback) {
    didVideoComplete = false;
    var AppPrizes_Title = title;
    if ((AppPrizes_Title == '' ) || (typeof AppPrizes_Title == 'undefined')) {
        AppPrizes_Title = document.title;
    }
    if (AppPrizes_Title == '') {
        AppPrizes_Title = 'Your game';
    }
    var AppPrizes_MessageText = messagetext;
    if ((AppPrizes_MessageText == '' ) || (typeof AppPrizes_MessageText == 'undefined')) {
        AppPrizes_MessageText = 'Support us by watching this short video from our Sponsor.';
    }
    var AppPrizes_ProgressText = progresstext;
    if ((AppPrizes_ProgressText == '' ) || (typeof AppPrizes_ProgressText == 'undefined')) {
        AppPrizes_ProgressText = AppPrizes_Title + " is loading shortly.";
    }
    var AppPrizes_Overlay = AppPrizes_jQuery("<div>").attr({'id': 'appprizes-overlay'});
    var AppPrizes_AutoPlay = autoplay;
    if ((AppPrizes_AutoPlay == '' ) || (typeof AppPrizes_AutoPlay == 'undefined')) {
        AppPrizes_AutoPlay = false;
    }
    var AppPrizes_AutoPlay = AppPrizes_AutoPlay;
    document.AppPrizes_AutoPlay = AppPrizes_AutoPlay;
    var AppPrizes_AutoPlayMuted = muted;
    if ((AppPrizes_AutoPlayMuted == '' ) || (typeof AppPrizes_AutoPlayMuted == 'undefined')) {
        AppPrizes_AutoPlayMuted = false;
    }
    var AppPrizes_AutoPlayMuted = AppPrizes_AutoPlayMuted;
    document.AppPrizes_AutoPlayMuted = AppPrizes_AutoPlayMuted;
    var AppPrizes_ControlBar = false;
    var AppPrizes_PlayerCode = "";
    if (document.AppPrizes_AutoPlayMuted) {
        AppPrizes_ControlBar = '{ "position": "bottom" }';
        AppPrizes_PlayerCode = '{ "modes": { "linear": { "controls": { "visible": false, "vpaid": { "visible": false }, "enableFullscreen": false, "enablePlay": false, "enablePause": false, "enableMute": true, "enableVolume": true } } } }';
    }
    document.AppPrizes_ControlBar = AppPrizes_ControlBar;
    document.AppPrizes_PlayerCode = AppPrizes_PlayerCode;
    var AppPrizes_Callback = null;
    if (dpacallback && typeof(dpacallback) === "function") {
        AppPrizes_Callback = dpacallback;
    }
    document.AppPrizes_Callback = AppPrizes_Callback;
    var positionStr = "";
    if (vposition == "top") {
        positionStr = "top: 200px; left: 50%;";
    } else if (vposition && vposition.substring(0, 4) == "top+") {
        var newtop = 200 + parseInt(vposition.substring(4));
        positionStr = "top: " + newtop + "px; left: 50%;";
    } else {
        // default vposition = middle
        positionStr = "top: 50%; left: 50%;";
    }
    AppPrizes_Overlay.html("<div id='appprizes-screen' style='border: 5px solid #efe4b0;margin: -184px -314px;position:absolute;width: 620px; height: 360px; " + positionStr + "'><a id='appprizes-close' style='display: none;position: absolute;top: -22px;right: -22px;width: 35px;height: 35px;background: transparent url(\"//developer.appprizes.com/images/close.png\");cursor: pointer;z-index: 99999;'></a><div id='ApplixirPlayer'></div><div id='progressbar' style='width: 618px;height: 32px;margin: 20px 0; float:left;'><div class='progress-label' style='float: left;width: 100%; margin-top: 9px;font-weight: bold;  text-shadow: 1px 1px 0 #fff; text-align: center;'>" + AppPrizes_Title + " is loading shortly.</div></div><div id='appprizes-backup' style='display: none;width:300px;height:250px;background:transparent;position:relative;z-index: 999999;top:-380px;left:160px;'></div></div>");
    AppPrizes_Overlay.prependTo("body");
    AppPrizes_Overlay.css({
        'background': 'transparent',
        'position': 'absolute',
        'width': '100%',
        'height': '100%',
        'z-index': 99999,
        'top': 0,
        'left': 0
    });
    var AppPrizes_image = AppPrizes_image;
    AppPrizes_jQuery('#appprizes-title').html(AppPrizes_MessageText);
    AppPrizes_jQuery('.progress-label').html(AppPrizes_ProgressText);

    didWeHideV = false;
    timer = setTimeout(hideV, 10000);
    jwplayer('ApplixirPlayer').setup({
        "flashplayer": assetHostAndPath + "/player/live/player.swf",
        "width": 620,
        "height": 360,
        "controlbar": false,
        "image": document.AppPrizes_image,
        "primary": 'flash',
        "mute": document.AppPrizes_AutoPlayMuted,
        "plugins": {
            "ova-jw": {
                "player": {
                    "modes": {
                        "linear": {
                            "controls": {
                                "visible": false,
                                "vpaid": {"visible": false},
                                "enableFullscreen": false,
                                "enablePlay": false,
                                "enablePause": false,
                                "enableMute": true,
                                "enableVolume": true
                            }
                        }
                    }
                },
                "canFireEventAPICalls": true,
                "ads": {
                    "skipAd": {
                        "enabled": false
                    },
                    "schedule": [
                        {
                            "position": "pre-roll",
                            "tag": tag
                        }
                    ]
                },
                "debug": {
                    "levels": "none"
                },
                "autoPlay": document.AppPrizes_AutoPlay
            }
        },
        "events": {
            onReady: function () {
                clearTimeout(timer);
                timer = setTimeout(hideV, 10000);
                AppPrizes_jQuery('#appprizes-close').click(function () {
                    AppPrizes_jQuery(this).hide();
                    hideV();
                });
                closeboxtimer = setTimeout("AppPrizes_jQuery('#appprizes-close').show()", DelayBeforeCloseButton);
            },
            onComplete: function () {
                didVideoComplete = true;
                setTimeout(hideV, 500);
                console.log('test complete');
            },
            onMute: function () {
                // alert('mute toggled!');
                // jwplayer().seek(0);
            },
            onBeforePlay: function () {
                console.log('test before play');
            },
            onBeforeComplete: function () {
                console.log('test before complete');
            },
            onPlay: function () {
                var duration = this.getDuration();
                if ((this.getPlaylistItem(0).file.indexOf("blank30") > 0) || (this.getPlaylistItem(0).file.indexOf("blank15") > 0) || (this.getPlaylistItem(0).file.indexOf("blank10") > 0)) {
                    setTimeout("onBackupBanner()", 100);
                }
                clearTimeout(timer);
                if (duration == 1) {
                    duration = defaultDuration;
                }
                else if (duration < 10) {
                    duration = 30;
                }
                function progress() {
                    if (progressbar.progressbar != null) {
                        var val = 0;
                        if (progressbar.progressbar("value") != null) {
                            val = progressbar.progressbar("value");
                        }
                        progressbar.progressbar("value", val + 1);
                        if (val < 99) {
                            AppPrizesTimer = setTimeout(progress, (duration / 100) * 1000);
                        } else {
                            console.log('test progress 99+');
                	    didVideoComplete = true;
                            if (typeof applixerPostRollHook == 'function') {
                                applixerPostRollHook();
                            }
                        }
                    }
                }

                progress();
            }
        }
    });
    var progressbar = AppPrizes_jQuery("#progressbar"), progressLabel = AppPrizes_jQuery(".progress-label");
    progressbar.progressbar({
        value: false,
        change: function () {
            progressLabel.text(AppPrizes_ProgressText + " " + progressbar.progressbar("value") + "%");
        },
        complete: function () {
            progressLabel.text("Complete!");
            if (jwplayer("ApplixirPlayer").getState() != "PLAYING") {
                if (probableAdError == true) {
                    setTimeout(hideV, 1500);
                }
            }
        }
    });
}
function onVPAIDAdComplete(ad) {
    didVideoComplete = true;
    setTimeout(hideV, 1500);
}
function onLinearAdComplete(ad) {
    didVideoComplete = true;
    setTimeout(hideV, 1500);
}
function onLinearAdFinish(ad) {
    didVideoComplete = true;
    setTimeout(hideV, 1500);
}
function onVPAIDAdStart(ad) {
    clearTimeout(timer);
}
function onNonLinearAdShow(ad) {
    clearTimeout(timer);
}
function onTrackingEvent(event) {
    if (event != null) {
        if (event.eventType == 'complete') {
            didVideoComplete = true;
            setTimeout(hideV, 1500);
            setTimeout(hideV, 1500);
        } else if (event.eventType == 'start') {
            clearTimeout(timer);
        }
    }
}
function onAdSchedulingComplete(ads) {
    if (ads.length > 0) {

    } else {
        setTimeout(hideV, 1500);
    }
}
function onVPAIDAdError(ad, state) {
    probableAdError = true;
}
function hideV() {

    if (didWeHideV) {
        return;
    } else {
        didWeHideV = true;
    }

    regexFilename = 'applixir_richmediaframe([_0-9a-f]*).html';
    pageFilename = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
    if (RegExp(regexFilename).test(pageFilename)) {
        if (didVideoComplete) {
            parent.postMessage("didVideoCompleteTrue", "*");
        } else {
            parent.postMessage("didVideoCompleteFalse", "*");
        }
        parent.postMessage("closeApplixirPlayer", "*");
    }
    clearTimeout(AppPrizesTimer);
    AppPrizes_jQuery("#appprizes-overlay").hide("slide", {}, 500, function () {
        AppPrizes_jQuery(this).remove();
        if (jwplayer("ApplixirPlayer")) {
            jwplayer("ApplixirPlayer").remove();
        }
        if (document.AppPrizes_Callback && typeof(document.AppPrizes_Callback) === "function") {
            document.AppPrizes_Callback(didVideoComplete);
        }
    });
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
function setFunctionifAllLoaded() {
    if (APXcounter < 3) return false;

    invokeVideoAd = function (muted, vposition, ivacallback) {
        muted = typeof muted !== 'undefined' ? muted : false;
        if (muted == 'mute' || muted == 'mute=true' || muted == 'muted' || muted == 'true' || muted == true) {
            muted = true;
        } else {
            muted = false;
        }
        doPopAd('', 'Your game will resume after this ad', 'Your game will resume after this message!', AutoplayOnPop, muted, vposition, ivacallback);
    }
}
function setCookie(cname, cvalue, exdays) {
    var expires = "expires=" + exdays.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
