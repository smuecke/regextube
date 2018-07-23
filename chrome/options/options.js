$("#case-sensitive").change(function() {
    chrome.storage.local.get("regextube-settings", function(value) {
        value["regextube-settings"]["case-sensitive"] = $("#case-sensitive").is(":checked");
        chrome.storage.local.set({ "regextube-settings" : value["regextube-settings"] });
    });
});

function initialize() {
    var settings;
    chrome.storage.local.get("regextube-settings", function(value) {
        if (Object.keys(value).length === 0)
            // default settings
            settings = { "case-sensitive": true };
        else
            settings = value["regextube-settings"];
        
        $("#case-sensitive").attr("checked", settings["case-sensitive"]);
    });
};

$(document).ready(initialize);
