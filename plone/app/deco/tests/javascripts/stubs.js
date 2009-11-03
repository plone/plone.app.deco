// Create tinyMCE stub object
var tinyMCE = {
    execCommand: function (cmd) {
        tinyMCE.lastexecuted = cmd;
    },
    reset: function () {
        tinyMCE.lastexecuted = "";
    },
    lastexecuted: ''
};