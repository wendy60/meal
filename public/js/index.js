$(function() {

    var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');
    var $customerInfo = $('#customerInfo');

    //switch to registration panel
    $loginBox.find('a.colMint').on('click', function() {
        $registerBox.show();
        $loginBox.hide();
    });

    //switch to login panel
    $registerBox.find('a.colMint').on('click', function() {
        $loginBox.show();
        $registerBox.hide();
    });

    //register
    $registerBox.find('button').on('click', function() {
        //Submit a request via ajax
        $.ajax({
            type: 'post',
            url: '/api/customer/register',
            data: {
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val(),
                repassword: $registerBox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function(result) {
                $registerBox.find('.colWarning').html(result.message);

                if (!result.code) {
                    //registration success
                    setTimeout(function() {
                        $loginBox.show();
                        $registerBox.hide();
                    }, 1000);
                }

            }
        });
    });

    //login
    $loginBox.find('button').on('click', function() {
        //submit a request via ajax
        $.ajax({
            type: 'post',
            url: '/api/customer/login',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function(result) {

                $loginBox.find('.colWarning').html(result.message);

                if (!result.code) {
                    //login successfully
                    window.location.reload();
                }
            }
        })
    })

    //logout
    $('#logout').on('click', function() {
        $.ajax({
            url: '/api/customer/logout',
            success: function(result) {
                if (!result.code) {
                    window.location.reload();
                }
            }
        });
    })



})