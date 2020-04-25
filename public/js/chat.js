//Make connection
var socket = io.connect('http://localhost:9001');

//Query DOM
var message = document.getElementById('message');
var username = document.getElementById('username');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

//Emit event
btn.addEventListener('click', function() {
    socket.emit('chat', {
        message: message.value,
        username: username.innerHTML
    });
});

message.addEventListener('keypress', function() {
    socket.emit('typing', username);
});

//Listen for events
socket.on('chat', function(data) {
    output.innerHTML += '<p><strong>' +
        data.username + ':</strong>' + data.message + '</p>';
});

socket.on('typing', function() {
    feedback.innerHTML = '<p><em>' +
        username.innerHTML + '  ' + 'is typing a message...</em></p>';
});