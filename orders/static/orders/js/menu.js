function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// sending cart orders AJAX
function sendData(form, type){
    const XHR = new XMLHttpRequest();
    // Set up our request
    var csrftoken = getCookie('csrftoken');
    XHR.open("POST", "/order_pizza" );

    // Callback function for when request completes
    XHR.onload = () => {
        const data = JSON.parse(XHR.responseText);

        if (data.success) {
          show_in_cart(data);
          alert('new Order is saved in your cart');
        }
        else {
            alert('failed to save order in cart');
        }
    };

    XHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  //  XHR.setRequestHeader('X-CSRFToken', csrftoken)
    // Bind the FormData object and the form element

    const FD = new FormData(form);
    // append the token
    FD.append('csrfmiddlewaretoken', csrftoken);

    let username = localStorage.getItem('username');
    FD.append('username', username);

    FD.append('type', type);
    // The data sent is what the user provided in the form
    XHR.send(FD);
    return false;
}

// send ajax to server to clear cart data
function sendcleardata(order_id){
    const XHR = new XMLHttpRequest();
    // Set up our request
    var csrftoken = getCookie('csrftoken');
    XHR.open("POST", "/clear_cart_data" );

    // Callback function for when request completes
    XHR.onload = () => {
        const data = JSON.parse(XHR.responseText);

        if (data.success) {
            //alert('cleared cart data at server')
        }
        else {
            alert('failed to clear cart data in server');
        }
    };

    XHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    // Bind the FormData object and the form element
    const FD = new FormData();
    // append the token
    FD.append('csrfmiddlewaretoken', csrftoken);

    console.log('order id is - ' + order_id);
    FD.append('oid', order_id);
    let username = localStorage.getItem('username');
    FD.append('username', username);

    // The data sent is what the user provided in the form
    XHR.send(FD);
}


function get_id_string(btn) {

  let div1_element = btn.parentElement;
  let td_element = div1_element.parentElement;
  let td2_element = td_element.nextElementSibling;
  let div2 = td2_element.children;
  let oid = div2[0].innerHTML;

  console.log(div2[0].innerHTML);
  return oid;
}

function clear_cart(btn) {
  let div1_element = btn.parentElement;
  let td_element = div1_element.parentElement;
  let tr = td_element.parentElement;
  let tds = tr.children;
  // sixth child has the price to be deleted
  let div2 = tds[5].children;
  let price = div2[0].innerHTML;
  price = price.slice(1);
  p = parseFloat(price);
  total_price = parseFloat(localStorage.getItem('total_price'));
  total_price -= p;
  localStorage.setItem('total_price', total_price);
  document.getElementById('total_in_cart').innerHTML = "$" + total_price;

  let table = document.getElementById('cart_table');
  table.deleteRow(tr.rowIndex);

  // check num of children to see if it's empty again
  if (table.children.length == 1) {
    let header = document.getElementById('cart_message');
        header.classList.remove('hide_cart_message');
  }

}
// empty_cart and remove data in server
function clear_cart_Ajax(btn) {
  let oid = get_id_string(btn);
  sendcleardata(oid);
  clear_cart(btn);
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
// <tr>
//   <td><div class="table_col"><button name="clear_btn">Remove</button></div></td>
//   <td><div class="table_col">113323</div></td>
//   <td><div class="table_col">Regular Pizza</div></td>
//   <td><div class="table_col">Small</div></td>
//   <td><div class="table_col">cheese, chicken, meatballs, onions, zuccini</div> </td>
//   <td><div class="table_col">$18.30</div></td>
// </tr>
// show_in_cart the table row and total price as calculated
function show_in_cart(data) {

  // inside here there is certianly data to attach to table
  // so we remove the message that says your cart is empty
  let header = document.getElementById('cart_message');
  if (!contains(header.classList, 'hide_cart_message')) {
    header.classList.add('hide_cart_message');
  }

  total_price = parseFloat(localStorage.getItem('total_price'));
  total_price += parseFloat(data.price);
  document.getElementById('total_in_cart').innerHTML = "$" + total_price;
  localStorage.setItem('total_price', total_price);

  // // make new row
  let table = document.getElementById('cart_table');
  const my_tr = document.createElement('tr');
  table.appendChild(my_tr);

  let td1 = document.createElement('td');
  let col1 = document.createElement('div');
  let btn = document.createElement('button');
  btn.setAttribute("name", "clear_btn");
  btn.innerHTML = "Remove";
  col1.className = "table_col";
  col1.appendChild(btn);
  td1.appendChild(col1);
  my_tr.appendChild(td1);

  btn.addEventListener("click", function () {
    console.log('delete a line from cart is pressed!');
    clear_cart_Ajax(btn);
  });

  let td2 = document.createElement('td');
  let col2 = document.createElement('div');
  col2.innerHTML = data.oid;
  col2.className = "table_col";
  td2.appendChild(col2);
  my_tr.appendChild(td2);

  let td3 = document.createElement('td');
  let col3 = document.createElement('div');
  col3.className = "table_col";
  col3.innerHTML = data.type + ' ' + data.name;
  td3.appendChild(col3);
  my_tr.appendChild(td3);

  let td4 = document.createElement('td');
  let col4 = document.createElement('div');
  col4.className = "table_col";
  col4.innerHTML = data.size;
  td4.appendChild(col4);
  my_tr.appendChild(td4);

  let td5 = document.createElement('td');
  let col5 = document.createElement('div');
  col5.className = "table_col";
  for (var i=0; i< data.topps.length; i++) {
    col5.innerHTML += data.topps[i] + ', ';
  }
  td5.appendChild(col5);
  my_tr.appendChild(td5);

  let td6 = document.createElement('td');
  let col6 = document.createElement('div');
  col6.className = "table_col";
  col6.innerHTML = "$" + data.price;
  td6.appendChild(col6);
  my_tr.appendChild(td6);

}

function make_order_AJAX() {
  const XHR = new XMLHttpRequest();
  // Set up our request
  var csrftoken = getCookie('csrftoken');
  XHR.open("POST", "/confirm_order" );

  // Callback function for when request completes
  XHR.onload = () => {
      const data = JSON.parse(XHR.responseText);

      if (data.success) {
          alert('Order has been placed');
          let btns = document.getElementsByName('clear_btn');
          for(var i = btns.length-1; i >=0 ; i--)
          {
            clear_cart(btns[i]);
          }
          // btns.forEach((btn) => {
          //     clear_cart_Ajax(btn);
          //     });
      }
      else {
          alert('failed to place order in server');
      }
  };

  XHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  //  XHR.setRequestHeader('X-CSRFToken', csrftoken)
  // Bind the FormData object and the form element

  const FD = new FormData();
  // append the token
  FD.append('csrfmiddlewaretoken', csrftoken);

  let username = localStorage.getItem('username');
  FD.append('username', username);

  // The data sent is what the user provided in the form
  XHR.send(FD);
  return false;
}



function Ajax_get_cart(username) {
  // get all the chats for this channel
  const request = new XMLHttpRequest();
  var csrftoken = getCookie('csrftoken');
  request.open('POST', '/cart');

  // Callback function for when request completes
  request.onload = () => {
  // Extract JSON data from request
      const data = JSON.parse(request.responseText);

      // Update the result div
      if (data.success) {
        cart = data.cart;
        if (cart) {
        //  alert(`chats is ${chats}`);
          let length = cart.length;
          for (var i =0 ;i <length; i++)
          {
            let data = cart[i];
            show_in_cart(data);
          }
        }
      }
      else {
        alert ('error in trying to get cart data from server')
      }
    }

    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    const data = new FormData();
    data.append('csrfmiddlewaretoken', csrftoken);
    data.append('username',username);
    //Send request
    request.send(data);
    return false;
}

function handleCart()
{
  const cart = document.getElementById('cart_box');
  let checkbox = document.getElementById('cart_check');
  if (checkbox.checked) {
      cart.classList.add('show_cart_box');
  }
  else {
    cart.classList.remove('show_cart_box');  // = cart.classList.filter(item => item!='show_cart_box' );
  }
}

function handleCartBack()
{
    document.getElementById('cart_check').checked = false;
    handleCart();
}


function ValidateToppSelection(name)
{
    var checkboxes = document.getElementsByName(name);
    var numberOfCheckedItems = 0;
    for(var i = 0; i < checkboxes.length; i++)
    {
        if(checkboxes[i].checked)
            numberOfCheckedItems++;
    }
    if(numberOfCheckedItems > 5)
    {
        alert("You can't select more than 5 toppings!");
    }
    return numberOfCheckedItems;
}

function clearForm(name) {

  let chks = document.getElementsByName(name);
  chks.forEach((chk) => {
    chk.checked = false;
  });
}


document.addEventListener('DOMContentLoaded', () => {

let username = document.getElementById("user_name").innerHTML;
localStorage.setItem('username', username);

//
// if (!localStorage.getItem('ids_counter')) localStorage.setItem('ids_counter', 0);
//
localStorage.setItem('total_price', 0.0);


let btns = document.getElementsByName('clear_btn');
btns.forEach((btn) => {
    btn.addEventListener("click", function () {
      console.log('delete a line from cart is pressed!');
      clear_cart_Ajax(btn);
    });
 });

document.getElementById('ConfirmOrder_Btn').onclick = () => {
    let header = document.getElementById('cart_message');
    if (contains(header.classList , 'hide_cart_message'))
      {
        let price = localStorage.getItem('total_price');
        let confirm = window.confirm("Do you confirm the order with total Price of $" + price.toString());
        if (confirm) {
          make_order_AJAX();
        }
      }
};

// let delete_completed_form = document.getElementById("delete_completed_form");
// delete_completed_form.addEventListener("submit", function (event) {
//   event.preventDefault();
//   sendDeleteOrders(form);
//   console.log("submitted delete all completed orders form");
// });
// fill in cart data from server immediately after dom content loaded
return Ajax_get_cart(username);
});
