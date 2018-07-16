$('.AddNew').click(function() {
    var row = $(this).closest('tr').clone();
    row.find('.Enabled').attr("checked", true);
    row.find('input[type="text"]').val('');
    row.find('.Inverted').attr("checked", false);
    $(this).closest('tr').after(row);
    $('input[type="button"]', row).removeClass('AddNew')
        .addClass('RemoveRow').val('Remove');
});

$('table').on('click', '.RemoveRow', function(){
    $(this).closest('tr').remove();
});

$('.Apply').click(function() {
    save();
});

/* storage value:
 * [{channel: "", title: "", inverted: false}, {…}, …]
 */

function initialize() {
    console.log("[RegexTube] Initialize");
    var regexes = [];
    let result = browser.storage.local.get("regextube");
    result.then(
        function(value) {
            regexes = value["regextube"];
            if (typeof regexes === 'undefined')
                regexes = [];
            
            var nrows = regexes.length;
            for(var k = 1; k < nrows; k++) {
                $('.AddNew').trigger("click");
            }
            
            $('.Enabled').attr("checked", function(i, old) {
                return regexes[i].enabled;
            });
            $('.Channel').val(function(i, old) {
                return regexes[i].channel;
            });
            $('.Title').val(function(i, old) {
                return regexes[i].title;
            });
            $('.Inverted').attr("checked", function(i, old) {
                return regexes[i].inverted;
            });
        }, alert
    );
}

function save() {
    var regexes = [];
    
    $('.Enabled').each(function(i) {
        regexes[i] = { enabled : $(this).is(':checked') };
    });
    $('.Channel').each(function(i) {
        regexes[i].channel = $(this).val();
    });
    $('.Title').each(function(i) {
        regexes[i].title = $(this).val();
    });
    $('.Inverted').each(function(i) {
        regexes[i].inverted = $(this).is(':checked');
    });
    
    browser.storage.local.set({ "regextube" : regexes })
        .catch(alert);
    
}

$(document).ready(() => initialize());
