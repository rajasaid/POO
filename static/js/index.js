function parse_msg(chatstr) {

    let i = chatstr.toString().indexOf(',');
    let msg = chatstr.toString().slice(i+1);
    return msg;
}
function parse_user(chatstr) {

    let i = chatstr.indexOf(',');
    let usr = chatstr.slice(0, i);
    return usr;
}
function fetch_user(msg){

    var temp = msg.toString().slice(2);
    let i = temp.toString().indexOf(' ');
    let usr = temp.toString().slice(0, i);
    return usr;
}
function chomp(msg) {
  //remove ::
  var temp = msg.toString().slice(2);
  //isolate user name
  let i = temp.toString().indexOf(' ');
  let mesg = temp.toString().slice(i+1);
  return mesg;
}
// clears  all the recent chats in the area preparing it for a new list of chats
function clear_recent() {

/*  var x = document.getElementsByClassName("list-group-item");
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].remove();
  }*/
  x = document.getElementsByClassName("temp_element");
//  alert(`x length is ${x.length}`);
  for (i = x.length-1; i >= 0; i--) {
    x[i].remove();
//    alert(`removing element ${x[i]}`);
  }
//  alert('clear func was called');
}

// fills in new chat elemens per request
function fill_in_recent(user, msg) {

//  alert (`trying to fill in recent`);
//  let id = localStorage.getItem('ids_counter');
//  alert (`id is equal to ${id}`);
  // Create new div content.
//  const cont1 = document.createElement('div');
//  cont1.className = 'list-group-item list-group-item-action list-group-item-light rounded-0';
//  cont1.id = "chat_elem" + id.toString();
//  var id_elem = document.getElementById('list_recent_msgs');
//  id_elem.appendChild(cont1);
//  var id_str = cont1.id;
//  id++;

  // added h6 of the sender name
  const cont2 = document.createElement('h6');
  cont2.className = 'mb-0 temp_element';
  cont2.innerHTML = user;
//  cont2.id = "chat_elem" + id.toString();
  id_elem = document.getElementById('list_recent_msgs');
  id_elem.appendChild(cont2);
//  id++;

  // added timestamp to the chat element
  const cont3 = document.createElement('small');
  cont3.className = 'small font-weight-bold temp_element';
  cont3.style = 'font-size=xx-small';
  const d = new Date();
  var utcDate = d.toUTCString();
  cont3.innerHTML = utcDate;
  id_elem = document.getElementById('list_recent_msgs');
  id_elem.appendChild(cont3);

  // added paragraph of the msg content
  const cont4 = document.createElement('p');
  cont4.className = 'font-italic mb-0 text-small temp_element';
  cont4.innerHTML = msg;
  id_elem = document.getElementById('list_recent_msgs');
  id_elem.appendChild(cont4);

//  localStorage.setItem('ids_counter', ++id);
//  alert (`filled in recent`);

}

// get chats from server for a particular channel
function Ajax_get_chats(channel) {
  // get all the chats for this channel
  const request2 = new XMLHttpRequest();
  request2.open('POST', '/chats');

  // Callback function for when request completes
  request2.onload = () => {
  // Extract JSON data from request
      const data = JSON.parse(request2.responseText);

      // Update the result div
      if (data.success) {
        chats = data.chats;
        if (chats) {
        //  alert(`chats is ${chats}`);
          let length = chats.length;
        //  alert(`length is ${length}`);
          for (i =0 ;i <length; i++)
          {

            let user = parse_user(chats[i]);
            let msg = parse_msg(chats[i]);
            // if message was peer-to-peer, appear only if we have the right user_name
            if (!msg.toString().startsWith('::')) {
              fill_in_recent(user,msg);
            }
            else {
              dest_user = fetch_user(msg);
              let x = document.getElementById("username_head").innerHTML;
            //  alert(`dest_user is ${dest_user} x is ${x}`);
              if (dest_user === x) {
                let my_msg = chomp(msg);
                fill_in_recent(user,my_msg);
              }
            }
          }

        }
      }
      else {

        alert ('error in trying to get chats from server')
      }
    }

    const data2 = new FormData();
    data2.append('channel',channel);
    //Send request
    request2.send(data2);
    return false;


}
document.addEventListener('DOMContentLoaded', () => {
//  alert('Hello, world!');
//  document.querySelector('#create-btn').disabled = true;
  document.querySelector('#sign-in-btn').disabled = true;
/*  if (!localStorage.getItem('ids_counter')) {
      localStorage.setItem('ids_counter', 1);
  }*/
  var recent_user = localStorage.getItem('username');
  if (recent_user) {
    let x = document.getElementById("username_head");
    x.innerHTML = recent_user;
  }



  // Enable sign-in-btn button only if there is text in the input field
  document.querySelector('#signintext').onkeyup = () => {
      if (document.querySelector('#signintext').value.length > 0)
          document.querySelector('#sign-in-btn').disabled = false;
      else
          document.querySelector('#sign-in-btn').disabled = true;
  };

  document.querySelector('#select_channels').onchange = function() {

    // Ajax set the channel to the user in the server
    const request = new XMLHttpRequest();
    request.open('POST', '/set_channel');

    request.onload = () => {
      const data = JSON.parse(request.responseText);

      // Update the name of the channel with #
      if (data.success) {
        localStorage.setItem('channel',this.value);
        let x = document.getElementById('chat_msg_head');
        x.innerHTML = '#' + this.value;
        //alert('updated server for user last channel');
      }
      else {
        alert('FAILED TO UPDATE SERVER WITH USERS LAST CHANNEL');
      }
    }
    const data = new FormData();
    data.append('channel',this.value);
    const myuser = localStorage.getItem('username');
    data.append('username', myuser);
    //Send request
    request.send(data);

    // clear all recent chats when the channel change
    clear_recent();

    return Ajax_get_chats(this.value);

  }
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // save the username and send to server
  document.querySelector('#form').onsubmit = () => {

    // save the username
    const username = document.querySelector('#signintext').value;

    // enable create channel button
    document.querySelector('#create-btn').disabled = false;

    // make an ajax request to save the display name in the server
     const request = new XMLHttpRequest();
     request.open('POST', '/signin');
     // Add data to send with request

     // Callback function for when request completes
     request.onload = () => {
     // Extract JSON data from request
        const data = JSON.parse(request.responseText);

         // Update the result div
         if (data.success) {
            localStorage.setItem('username', data.username);
            let x = document.getElementById("username_head");
            x.innerHTML = data.username;
            var contents = 'welcome ' + data.username;
            //contents.concat(username);
            document.querySelector('#signintext').value = contents;
            //clear previous chats history upon user exchange
            clear_recent();
         }
         else {
             document.querySelector('#signintext').value = 'There was an error.';
         }

     }
     const data = new FormData();
     data.append('username', username);

     //Send request
     request.send(data);
     return false;

    }

    // add a channel upon creation and send to server
    document.querySelector('#create_channel_form').onsubmit = () => {

        const option = document.createElement('option');
        option.innerHTML = document.querySelector('#channeltext').innerHTML;
        option.value = document.querySelector('#channeltext').value;
        option.text = document.querySelector('#channeltext').value;

        //document.querySelector('#select_channels').appendChild(option);

        // make an ajax request to save the the new channel in the server
        const request = new XMLHttpRequest();
        request.open('POST', '/new_channel');

        // Callback function for when request completes
        request.onload = () => {
        // Extract JSON data from request
           const data = JSON.parse(request.responseText);

            // Update the result div
            if (data.success) {
                x = document.getElementById("select_channels");
                x.add(option,0);
              //  alert('a new channel was added!');
              //  const contents = 'Success';
              //  document.querySelector('#signintext').value = contents;
              //  localStorage.setItem('username', username);
            }
            else {
                alert('Server rejected channel creation!');
              //  document.querySelector('#channeltext').value = 'There was an error.';
            }
        }

        const data = new FormData();
        data.append('channel', option.value);

        //Send request
        request.send(data);
        return false;

      };

      // refresh button behave just like channel select .onchange
      document.querySelector('#refresh_btn').onclick = () => {

        if (localStorage.getItem('username')) {
          let cnl = document.getElementById('chat_msg_head').innerHTML;
          cnl = cnl.toString().slice(1);
        //  alert(`getting chats for ${cnl}`);
          clear_recent();
          return Ajax_get_chats(cnl);
        }

      }

      document.querySelector('#chat_msgs_form').onsubmit = () => {

        var elem = document.getElementById("username_head");
        const username = elem.innerHTML;
        elem = document.getElementById('chat_msg_head');
        var cnl = elem.innerHTML.split('#');
        const channel = cnl[1];
        elem = document.querySelector('#chat_msg_body');
        const message = elem.value;

        socket.emit('message', {'username': username, "channel": channel, "message": message});

        return false;
      }
      socket.on('msg_peer', data => {
        let elem = document.getElementById('chat_msg_head');
        let cnl = elem.innerHTML.split('#');
        const channel = cnl[1];
        let user_elem = document.getElementById('username_head');
        let user_name = user_elem.innerHTML;
        let x_user = fetch_user(data.message);
      //  in case the user is sending to himself
        if (channel === data.channel) {
            if (user_name === x_user) {
              let msg = chomp(data.message);
              fill_in_recent(data.username, msg);
            }
        }

      });
      socket.on('msg_cast', data => {

        //let cnl = localStorage.getItem('channel');
        let elem = document.getElementById('chat_msg_head');
        let cnl = elem.innerHTML.split('#');
        const channel = cnl[1];
      //  alert(`cnl is ${channel} data channel is ${data.channel}`);
        if (channel === data.channel) {
          fill_in_recent(data.username, data.message);
        }
      //  alert(' done all the job');
      });

      if (localStorage.getItem('username')) {

        // Ajax get the last channel of user from the server
        const request = new XMLHttpRequest();
        request.open('POST', '/get_channel');

        request.onload = () => {
          const data = JSON.parse(request.responseText);

          // Update the result
          if (data.success) {
            let x = document.getElementById('chat_msg_head');
            x.innerHTML = '#' + data.channel;
            localStorage.getItem('channel', data.channel);
          }
          else {
            alert('NEW USERS\` LAST CHANNEL is not important');
          }
        }

        const data = new FormData();
        const myuser = localStorage.getItem('username');
        data.append('username', myuser);
        //Send request
        request.send(data);
        return false;
      }
    });
