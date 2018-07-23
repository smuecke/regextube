var regexes;

function initialize() {
    console.log("[RegexTube] Initialize");    
    chrome.storage.local.get("regextube", function(value) {
        if (Object.keys(value).length === 0) {
            chrome.storage.local.set({ "regextube": [] });
            value["regextube"] = [];
        }
        
        buildRegexes(value["regextube"]);
        startUpdateLoop();
    });
}

function startUpdateLoop() {
    chrome.storage.onChanged.addListener(updateRegexes);
    setTimeout(refreshVideos, 100);
    setInterval(refreshVideos, 2000);
}

function buildRegexes(popupData) {
    var caseSensitive = true;
    chrome.storage.local.get("regextube-settings", function(value) {
        if (Object.keys(value).length === 0) {
            // no settings values => save default settings
            var settings = { "case-sensitive": true };
            chrome.storage.local.set({ "regextube-settings" : settings });
        }
        
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
    });
}

function updateRegexes(changes, area) {
    if ("regextube" in changes) {
        buildRegexes(changes["regextube"].newValue);
        
        // filter again, because some videos might not match anymore
        $('ytd-grid-video-renderer')
            .attr("filtered", null)
            .show();
    }
}

function refreshVideos() {
    var hidden = 0;
    $('ytd-grid-video-renderer:not([filtered])').each(function() {
        let channel = $(this).find('yt-formatted-string').children('a').text();
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
