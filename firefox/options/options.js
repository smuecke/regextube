$("#case-sensitive").change(function() {
    let getSettings = browser.storage.local.get("regextube-settings");
    getSettings.then(function(value) {
        var settings = value["regextube-settings"];
        if (typeof settings === "undefined")
            settings = {};
        
        settings["case-sensitive"] = $("#case-sensitive").is(":checked");
        browser.storage.local.set({ "regextube-settings" : settings });
    });
});

function initialize() {
    var settings;
    let getSettings = browser.storage.local.get("regextube-settings");
    getSettings.then(function(value) {
        settings = value["regextube-settings"];
        $("#case-sensitive").attr("checked", settings["case-sensitive"]);
    }, function(reason) {
        // no settings values => save default settings
        var settings = { "case-sensitive": true };
        browser.storage.local.set({ "regextube-settings" : settings });
        initialize();
    });
};

$(document).ready(function() {
    initialize();
    
    $("#import-json").click(function() {
        // TODO
    });
});
