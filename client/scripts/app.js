// YOUR CODE HERE:
//

var app = {
  init: function(){
    // initial populate
    // set last date

  },

  username: 'bob',

  chatroom: 'lobby',

  lastDate: new Date().toISOString(),

  get: function(room, lastDate){
    // var wherestring = { where: {roomname: room},
    //                            createdAt: { $gte : {__type:'Date',
    //                                                    iso: lastDate }}},
    //                                order: '-createdAt', limit:10 };
    //
    var wherestring = {where: {roomname: room}, order: '-createdAt'};
    wherestring = JSON.stringify(wherestring);


   $.get('https://api.parse.com/1/classes/chatterbox/',
    wherestring,
    function(data){console.log(data);
      if(data.results){
        data.results.forEach(function(result){
            app.displayMessage(app.parseMessage(result));
          });
      }
    });
  },

  parseMessage: function(data) {
    var message = {};
    message.text = _.escape(data.text);
    message.time = new Date(data.createdAt).toLocaleString();
    message.username = _.escape(data.username);
    return message;
  },

  displayMessage: function(message){
    var text = message.text;
    var time = message.time;
    var username = message.username;
    var display = '<li>'+time+'- '+username+': '+text +'</li>';
    $('.chatMessages').append(display);
  },

  // send: function(message){
  //   $.ajax({
  //   // always use this url
  //     url: 'https://api.parse.com/1/classes/chatterbox/',
  //     type: 'POST',
  //     data: JSON.stringify({username: message.username,
  //            text: message.text,
  //            roomname: message.roomname}),
  //     contentType: 'application/json',
  //     success: function (data) {
  //       console.log(data);
  //     },
  //     error: function (data) {
  //     // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
  //       console.error('chatterbox: Failed to send message');
  //     }
  //   });
  // },


  createMessage:function(response){

  },

};

$(function(){
  app.get('will');
  $('.sendButton').on('click',function(event){
      var message = $('.messages').val();
      createMessage(message);
    });

// app.send('mitch', 'HOLA', 'will');
// app.displayMessage({text:'hola', time: 'today', username: 'mitch'});

});

// REST
// where: {"roomname": "lobby", "createdAt": {"$gte":{"__type":"Date","iso":"2014-06-17T02:24:59.308Z"}}}
// createdAt: -createdAt
