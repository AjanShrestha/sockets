var socket = io();

socket.on('connect', () => {
    console.log('Connected to socket.io server');
});

socket.on('message', (message) => {
    console.log('New message');
    console.log(message.text);

    jQuery('.messages').append('<p>' + message.text +'</p>');
});

// Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', (event) => {
    event.preventDefault();

    var $message = $form.find('input[name=message]');

    socket.emit('message', {
        text: $message.val()
    });

    $message.val('');
});