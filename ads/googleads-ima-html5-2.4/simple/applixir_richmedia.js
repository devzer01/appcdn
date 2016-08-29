var parentApplixirCallback;
var parentDidVideoComplete = false;
var ApplixirParameterUserID = "";
var ApplixirParameterGameID = "";
var ApplixirParameterOptional = "";

var closeApplixirPlayer = function () {
    hideApplixirFrame();
    if (parentApplixirCallback && typeof(parentApplixirCallback) === "function") {
        parentApplixirCallback(parentDidVideoComplete)
    }
};

var parentApplixirMessageHandler = function (e) {
    console.log(e);
    switch (e.data) {
        case "didVideoCompleteTrue":
            parentDidVideoComplete = true;
            break;
        case "didVideoCompleteFalse":
            parentDidVideoComplete = false;
            break;
        case "closeApplixirPlayer":
            setTimeout(closeApplixirPlayer, 1000);
            break;

    }
};

window.addEventListener('message', parentApplixirMessageHandler, false);

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
    showApplixirFrame("middle");
    a.postMessage("displayApplixirAd", "*")
}

function invokeApplixirVideoUnitExtended(a, d, c) {
    if (a == "mute" || a == "mute=true" || a == "muted" || a == "true" || a == true) {
        a = true
    } else {
        a = false
    }
    showApplixirFrame(d);
    var b = document.getElementById("applixir_vanishing_frame").contentWindow;
    b.postMessage("displayApplixirAd", "*");
    if (c) {
        parentApplixirCallback = c
    }
};