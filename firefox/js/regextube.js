var regexes;

function initialize() {
    console.log("[RegexTube] Initialize");    
    let fetchRegexes = browser.storage.local.get("regextube");
    fetchRegexes.then(function(value) {
        buildRegexes(value["regextube"]);
        startUpdateLoop();
    }, function(reason) {
        browser.storage.local.set({ "regextube": [] });
        startUpdateLoop();
    });
}

function startUpdateLoop() {
    browser.storage.onChanged.addListener(updateRegexes);
    setTimeout(refreshVideos, 100);
    setInterval(refreshVideos, 2000);
}

function buildRegexes(popupData) {
    var caseSensitive = true;
    let getSettings = browser.storage.local.get("regextube-settings");
    getSettings.then(function(value) {
        caseSensitive = value["regextube-settings"]["case-sensitive"];
        if (typeof caseSensitive === "undefined")
            caseSensitive = true;
        
        var flags = caseSensitive ? "" : "i";
        regexes = [];
        popupData.forEach(function(obj) {
            regexes.push({
                enabled:  obj.enabled,
                channel:  obj.channel === "" ? null : new RegExp(obj.channel, flags),
                title:    new RegExp(obj.title, flags),
                inverted: obj.inverted
            });
        });
    }, function(reason) {
        // no settings values => save default settings
        var settings = {"case-sensitive": true};
        browser.storage.local.set({ "regextube-settings" : settings });
        
        // try again
        buildRegexes(popupData);
    });
}

function updateRegexes(changes, area) {
    if ("regextube" in changes) {
        buildRegexes(changes["regextube"].newValue);
        
        // filter again, because some videos might not match anymore
        $('li.yt-shelf-grid-item')
            .attr("filtered", null)
            .show();
    }
}

function refreshVideos() {
    var hidden = 0;
    $('li.yt-shelf-grid-item:not([filtered])').each(function() {
        let channel = $(this).find('div.yt-lockup-byline').children('a').text();
        let title   = $(this).find('a[title]').attr('title');
        
        let n = regexes.length;
        for (var i = 0; i < n; i++) {
            
            // if regex is not enabled or channel does not match, do nothing;
            if (!regexes[i].enabled
                || (regexes[i].channel != null
                    && channel.match(regexes[i].channel) == null))
                continue;
        
            let titleMatch   = title.match(regexes[i].title) != null;
            let inv          = regexes[i].inverted;
            
            if ((titleMatch && !inv) || (!titleMatch && inv)) {
                $(this).hide();
                ++hidden;
                break;
            }
        }
        
        $(this).attr("filtered", "");
    });
    
    if (hidden > 0)
        console.log("[RegexTube] Hiding", hidden, "videos");
}

$(document).ready(initialize);
