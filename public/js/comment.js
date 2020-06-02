var prepage = 2;
var page = 1;
var pages = 0;
var comments = [];

//submit comment
$('#messageBtn').on('click', function() {
    $.ajax({
        type: 'POST',
        url: '/api/comment/post',
        data: {
            restaurantid: $('#restaurantId').val(), //corrent ID of restaurant
            content: $('#messageContent').val() //context of comment
        },
        success: function(responseData) {
            //console.log(responseData);
            $('#messageContent').val(''); //clear comment
            comments = responseData.data.comments.reverse(); //make order -- show new comment first
            renderComment(responseData.data);
        }
    })
});

//get all comments for this restaurant every time the page reloads
$.ajax({
    url: '/api/comment',
    data: {
        restaurantid: $('#restaurantId').val()
            //content: $('#messageContent').val()
    },
    success: function(responseData) {
        comments = responseData.data.reverse();
        renderComment();
    },
});


// link to turn page
$('.pager').delegate('a', 'click', function() {
    if ($(this).parent().hasClass('previous')) {
        page--;
    } else {
        page++;
    }
    renderComment();
});

function renderComment() {

    $('#messageCount').html(comments.length);

    pages = Math.max(Math.ceil(comments.length / prepage), 1);
    var start = Math.max((page - 1) * prepage);
    var end = Math.min(start + prepage, comments.length);

    var $lis = $('.pager li');
    $lis.eq(1).html(page + ' / ' + pages);
    if (page <= 1) {
        page = 1;
        $lis.eq(0).html('<span>no previous page</span>');
    } else {
        $lis.eq(0).html('<a href="javascript:;">previous page</a>');
    }

    if (page >= pages) {
        page = pages;
        $lis.eq(2).html('<span>no next page</span>');
    } else {
        $lis.eq(2).html('<a href="javascript:;">next page</a>');
    }
    if (comments.length == 0) {
        $('.messageList').html('<div class="messageBox"><p>have not comment yet</p></div>');
    } else {
        var html = '';
        for (var i = start; i < end; i++) {
            html += '<div class="messageBox">' +
                '<p class="name clear"><span class="fl">' +
                comments[i].username + '</span><span class="fr">' +
                formatDate(comments[i].postTime) + '</span></p><p>' +
                comments[i].content + '</div>';
        }
        $('.messageList').html(html);
    }





    var html = '';
    for (var i = start; i < end; i++) {
        html += '<div class="messageBox">' +
            '<p class="name clear"><span class="fl">' +
            comments[i].username + '</span><span class="fr">' +
            formatDate(comments[i].postTime) + '</span></p><p>' +
            comments[i].content + '</div>';
    }
    $('.messageList').html(html);
}



function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear() + '.' +
        (date1.getMonth() + 1) + '.' + date1.getDate() + ' ' +
        date1.getHours() + ':' + date1.getMinutes() +
        ':' + date1.getSeconds();
}