
function sendSubData(form) {

  const XHR = new XMLHttpRequest();
  // Set up our request
  var csrftoken = getCookie('csrftoken');
  XHR.open("POST", "/order_sub" );

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

  // The data sent is what the user provided in the form
  XHR.send(FD);
  return false;
}

function clearsubForm() {

  radios = document.getElementsByName('subs');
  radios.forEach((radio) => { radio.checked = false;
  });

}

document.addEventListener('DOMContentLoaded', () => {


let sub_form = document.getElementById('form_sub_order');

//  take over its submit event.
sub_form.addEventListener("submit", function (event) {
    items = ValidateToppSelection('sub-topping');

    event.preventDefault();
    let total_price = 0.0;
    total_price += items*0.5; // each sub-topping is $0.5
    if (document.getElementById('extra_cheese').checked) { total_price += 0.5; }
    let sub = document.querySelector('input[name="subs"]:checked');
    if (sub === null) {
      alert (" please choose one sub before adding to cart ");
      clearForm('sub-topping');
      return false;
    }
    let my_sub = sub.value;
    console.log("my shosen sub is " + my_sub);
    if (document.getElementById('small').checked === true) {
      switch(my_sub) {
        case "Cheese": total_price += 6.95;
        break;
        case "Italian": total_price += 6.95;
        break;
        case "Ham + Cheese": total_price += 6.95;
        break;
        case "Meatball": total_price += 6.95;
        break;
        case "Tuna": total_price += 6.95;
        break;
        case "Turkey": total_price += 7.50;
        break;
        case "Chicken Parmigiana": total_price += 7.95;
        break;
        case "Eggplant Parmigiana": total_price += 6.95;
        break;
        case "Steak": total_price += 6.85;
        break;
        case "Steak + Cheese": total_price += 7.60;
        break;
        case "Sausage, Peppers & Onions": total_price = 0;
          alert("The Sub is Large Only");
          clearForm('sub-topping');
          clearsubForm();
          return false;
        break;
        case "Hamburger": total_price += 5.10;
        break;
        case "Cheeseburger": total_price += 5.60;
        break;
        case "Fried Chicken": total_price += 6.95;
        break;
        case "Veggie": total_price += 6.95;
        break;
        default:
          total_price = 0;
          alert("The Sub is un-expected!");
          clearForm('sub-topping');
          clearsubForm();
          return false;
      }
    }
    else {
      switch(my_sub) {
        case "Cheese": total_price += 8.50;
        break;
        case "Italian": total_price += 8.50;
        break;
        case "Ham + Cheese": total_price += 8.50;
        break;
        case "Meatball": total_price += 8.50;
        break;
        case "Tuna": total_price += 8.50;
        break;
        case "Turkey": total_price += 8.50;
        break;
        case "Chicken Parmigiana": total_price += 8.95;
        break;
        case "Eggplant Parmigiana": total_price += 8.50;
        break;
        case "Steak": total_price += 8.50;
        break;
        case "Steak + Cheese": total_price += 9.25;
        break;
        case "Sausage, Peppers & Onions": total_price = 8.95;
        break;
        case "Hamburger": total_price += 7.45;
        break;
        case "Cheeseburger": total_price += 7.95;
        break;
        case "Fried Chicken": total_price += 8.95;
        break;
        case "Veggie": total_price += 8.95;
        break;
        default:
          total_price = 0;
          alert("The Sub is un-expected!");
          clearForm('sub-topping');
          clearsubForm();
          return false;
      }

    }
    document.getElementById('subs_total_price').innerHTML = "$" + total_price.toString();
    sendSubData(sub_form);
    clearForm('sub-topping');
    clearsubForm();
    console.log('Submited! add to cart sub');

});

});
