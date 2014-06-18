// YOUR CODE HERE:
//

var app = {
  id: 0,

  friends: {},

  username: null,

  chatroom: 'lobby',

  lastDate: null,

  allRooms: [],

  init: function() {
    app.username = window.location.search.slice(10);
    // ajax call - get a list of rooms => limit 1000, order: -createdAt
    $.ajax({
      type: 'GET',
      url: 'https://api.parse.com/1/classes/chatterbox/',
      data: {order: '-createdAt', limit: 1000},
      contentType: 'application/JSON',
      success: function(data) {
          app.populateRooms(data.results);
          app.renderRoomSelection()
          var d = new Date();
          d.setTime(d.getTime()-10000000);
          app.fetch(app.chatroom, d);
          app.refresh();
          $('.sendButton').on('click',app.sendMessage);
          $('select').change(app.changeChatroom);
          $('.sendUser').on('click', app.newUser);
          $('.sendChatroom').on('click', app.addChatroom);
      }
    });

  },

  friend: function(user){
    var user = $(this).attr('class');
    app.friends[user] = true;
    $('.'+user).attr('class','bold');
  },

  addChatroom: function(){
    chatName = $('.currentChatroom').val();
    app.chatroom = chatName;
    app.allRooms.push(chatName);
    $option = $('<option>',{value:chatName}).text(chatName);
    $('select').append($option);
    $option.attr('selected','');
    app.changeChatroom();

  },

  newUser: function(){
    var user = $('.username').val();
    app.username = user;
    $('.username').val('');
  },

  changeChatroom: function(){
   app.chatroom = $('select option:selected').text();
    $('.chatroom').text(app.chatroom);
    app.breakRefresh();
    $('.chatMessages').empty();
    d = new Date();
    d.setTime(d.getTime()-10000000);
    app.lastDate = d;
    app.fetch(app.chatroom, app.lastDate);
    app.refresh();
  },

  sendMessage: function(){
    var message = $('.messages').val();
    app.send(app.createMessage(message));
  },

  populateRooms: function(messages){
    var rooms = {};
    messages.forEach(function(result) {
    var thisRoom = result.roomname;
      if(!rooms.hasOwnProperty(thisRoom)) {
        rooms[thisRoom] = true;
      }
    });

    for(var room in rooms) {
      app.allRooms.push(room);
    }
  },

  renderRoomSelection: function(){
    var check = 0;
    app.allRooms.forEach(function(room){
      $option = $('<option>',{value:room}).text(room);
      if (room === app.chatroom){
        $option.attr('selected','');
        check = 1;
      }
        $('select').append($option);
    });
    if(check === 0){
    app.chatroom = app.allRooms[0];
    }
    $('.chatroom').append('p').text(app.chatroom);
  },

  reload: null,

  breakRefresh: function(){
    clearInterval(app.reload);
  },

  refresh: function(){
    app.reload = setInterval(function(){
        app.fetch(app.chatroom, app.lastDate);
      }, 1000);
  },

  fetch: function(room, lastDate) {
    var wherestring = {roomname: room,
                      createdAt: {$gte: {__type: 'Date',
                                   iso: lastDate.toISOString() }}};
    $.ajax({
      type: 'GET',
      url: 'https://api.parse.com/1/classes/chatterbox/',
      data: {where: JSON.stringify(wherestring), order: '-createdAt', limit: 10},
      contentType: 'application/JSON',
      success: function(data) {
        if (data.results.length > 0) {
          data.results.reverse().forEach(function(result) {
            app.displayMessage(app.parseMessage(result));
          });
          app.lastDate = new Date();
        }
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

  displayMessage: function(message) {
    var text = message.text;
    var time = message.time;
    var username = message.username;
    var $display = $('<li>')
    $display.attr('class',username);
    if (username in app.friends){
      $display.attr('class','bold');
    }
    $display.attr('id',++app.id);
    $display.text(username+' ' + time + '- ' + username + ': ' + text)
    $('.chatMessages').prepend($display);
    $('#'+app.id).on('click', app.friend);
  },

  send: function(message){
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox/',
      type: 'POST',
      data: JSON.stringify({username: message.username,
             text: message.text,
             roomname: message.roomname}),
      contentType: 'application/json',
      success: function (data) {
      },
      error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },


  createMessage: function(message) {
    return {
      username: app.username,
      text: message,
      roomname: app.chatroom
    };

  },

};

$(function() {


  app.init();


  // app.get('lobby', app.lastDate);

});

// REST
// where: {"roomname": "lobby", "createdAt": {"$gte":{"__type":"Date","iso":"2014-06-17T02:24:59.308Z"}}}
// createdAt: -createdAt
