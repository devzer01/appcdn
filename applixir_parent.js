var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
var ApplixirParameterUserID = "";
var ApplixirParameterGameID = "";
var ApplixirParameterOptional = "";
function showVideoAdWhenReady() {
    if (typeof invokeVideoAd == "function") {
        invokeVideoAd()
    } else {
        setTimeout(function () {
            showVideoAdWhenReady()
        }, 500)
    }
}
eventer(messageEvent, function (c) {
    var a = c.message ? "message" : "data";
    var b = c[a];
    if (b == "displayApplixirAd") {
        showVideoAdWhenReady()
    }
    if (b.indexOf("SetApplixirUID") == 0) {
        ApplixirParameterUserID = b.slice("SetApplixirUID=".length);
        rescheduleWithUIDAdPosition("pre-roll")
    }
    if (b.indexOf("SetApplixirGID") == 0) {
        ApplixirParameterGameID = b.slice("SetApplixirGID=".length);
        rescheduleWithUIDAdPosition("pre-roll")
    }
    if (b.indexOf("SetApplixirOptional") == 0) {
        ApplixirParameterOptional = b.slice("SetApplixirOptional=".length);
        rescheduleWithUIDAdPosition("pre-roll")
    }
}, false);
regexFilename = "applixir_richmediaframe([_0-9a-f]*).html";
pageFilename = window.location.href.substr(window.location.href.lastIndexOf("/") + 1);
thisClientScript = "";
if (RegExp(regexFilename).test(pageFilename)) {
    thisClientScript = "//static.appcdn.net/jsembed/embed_" + pageFilename.match(regexFilename)[1].slice(1) + ".js"
}
;