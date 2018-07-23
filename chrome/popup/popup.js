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

$('.Apply').click(save);

/* storage value:
 * [{channel: "", title: "", inverted: false}, {…}, …]
 */

function initialize() {
    var regexes;
    chrome.storage.local.get("regextube", function(value) {
        if (Object.keys(value).length === 0)
            regexes = [];
        else
            regexes = value["regextube"];
        
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
    });
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
    
    chrome.storage.local.set({ "regextube" : regexes })
}

$(document).ready(initialize);
