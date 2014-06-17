// YOUR CODE HERE:
//

var app = {
  init: function(){},

  send: function(username, text, roomname){
    $.ajax({
    // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox/',
      type: 'POST',
      data: JSON.stringify({username: username,
             text: text,
             roomname: roomname}),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
      },
      error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  get: function(room){
    var wherestring = {where: {roomname: room}, order: '-createdAt'};
    // wherestring = JSON.stringify(wherestring);
    // var wherestring = 'order=-createdAt';

   $.get('https://api.parse.com/1/classes/chatterbox/',
    wherestring,

    function(data){
      console.log(data);
      data.results.forEach(function(result){
        if(result.roomname === room) {
          app.displayMessage(app.createMessage(result));
        }
      });
    });
  },

  createMessage: function(data) {
    console.log(data);
    var message = {};
    message.text = data.text;
    message.time = new Date(data.createdAt).toLocaleString();
    message.username = data.username;

    return message;
  },

  displayMessage: function(message){
    var text = message.text;
    var time = message.time;
    var username = message.username;
    var display = '<li>'+text+time+username +'</li>';
    console.log(display);
    $('.chatMessages').append(display);
  }



};

$(function(){
app.get('lobby');
// app.send('mitch', 'HOLA', 'will');
// app.displayMessage({text:'hola', time: 'today', username: 'mitch'});

});

// where={
//   "roomname":{
//     "$notInQuery":{
//       "where":{
//         "image":{
//           "$exists":true}},
//           "className":"Post"}}}

