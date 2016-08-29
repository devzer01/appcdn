var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
var parentApplixirCallback;
var parentDidVideoComplete = false;
var ApplixirParameterUserID = "";
var ApplixirParameterGameID = "";
var ApplixirParameterOptional = "";
eventer(messageEvent, function (c) {
    var a = c.message ? "message" : "data";
    var b = c[a];
    if (b == "didVideoCompleteTrue") {
        parentDidVideoComplete = true
    }
    if (b == "didVideoCompleteFalse") {
        parentDidVideoComplete = false
    }
    if (b == "closeApplixirPlayer") {
        setTimeout(function () {
            hideApplixirFrame();
            if (parentApplixirCallback && typeof(parentApplixirCallback) === "function") {
                parentApplixirCallback(parentDidVideoComplete)
            }
        }, 1000)
    }
}, false);
function showApplixirFrame(b) {
    if (b == "top") {
        positionStr = "200px"
    } else {
        if (b && b.substring(0, 4) == "top+") {
            var a = 200 + parseInt(b.substring(4));
            positionStr = a + "px"
        } else {
            positionStr = "50%"
        }
    }
    document.getElementById("applixir_vanishing_frame").width = "678px";
    document.getElementById("applixir_vanishing_frame").height = "527px";
    applixir_vanishing_div.style.position = "absolute";
    applixir_vanishing_div.style.top = positionStr;
    applixir_vanishing_div.style.left = "50%";
    applixir_vanishing_div.style.margin = "margin: -250px -316px"
}
function hideApplixirFrame() {
    document.getElementById("applixir_vanishing_frame").width = "8px";
    document.getElementById("applixir_vanishing_frame").height = "8px";
    applixir_vanishing_div.style.position = "absolute";
    applixir_vanishing_div.style.top = "1%";
    applixir_vanishing_div.style.left = "1%";
    applixir_vanishing_div.style.margin = "margin: -250px -316px"
}
function invokeApplixirVideoUnit() {
    var a = document.getElementById("applixir_vanishing_frame").contentWindow;
    if (ApplixirParameterUserID) {
        a.postMessage("SetApplixirUID=" + ApplixirParameterUserID, "*")
    }
    if (ApplixirParameterGameID) {
        a.postMessage("SetApplixirGID=" + ApplixirParameterGameID, "*")
    }
    if (ApplixirParameterOptional) {
        a.postMessage("SetApplixirOptional=" + ApplixirParameterOptional, "*")
    }
    showApplixirFrame("middle");
    a.postMessage("displayApplixirAd", "*")
}
function invokeApplixirVideoUnitExtended(a, d, c) {
    if (a == "mute" || a == "mute=true" || a == "muted" || a == "true" || a == true) {
        a = true
    } else {
        a = false
    }
    var b = document.getElementById("applixir_vanishing_frame").contentWindow;
    if (ApplixirParameterUserID) {
        b.postMessage("SetApplixirUID=" + ApplixirParameterUserID, "*")
    }
    if (ApplixirParameterGameID) {
        b.postMessage("SetApplixirGID=" + ApplixirParameterGameID, "*")
    }
    if (ApplixirParameterOptional) {
        b.postMessage("SetApplixirOptional=" + ApplixirParameterOptional, "*")
    }
    showApplixirFrame(d);
    b.postMessage("displayApplixirAd", "*");
    if (c) {
        parentApplixirCallback = c
    }
};