function sendPlatterData(form) {

  const XHR = new XMLHttpRequest();
  // Set up our request
  var csrftoken = getCookie('csrftoken');
  XHR.open("POST", "/order_platter" );

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

function clearPlatterForm() {

  radios = document.getElementsByName('platter');
  radios.forEach((radio) => { radio.checked = false;
  });

}

document.addEventListener('DOMContentLoaded', () => {


let platter_form = document.getElementById('form_platter_order');

//  take over its submit event.
platter_form.addEventListener("submit", function (event) {

    event.preventDefault();
    let total_price = 0.0;
    let platter = document.querySelector('input[name="platter"]:checked');
    if (platter === null) {
      alert (" please choose one Platter before adding to cart ");
      return false;
    }
    let my_platter = platter.value;
    console.log("my shosen platter is " + my_platter);
    if (document.getElementById('small').checked === true) {
      switch(my_platter) {
        case "Garden Salad": total_price = 40;
        break;
        case "Greek Salad": total_price = 50;
        break;
        case "Antipasto": total_price = 50;
        break;
        case "Baked Ziti": total_price = 40;
        break;
        case "Meatball Parm": total_price = 50;
        break;
        case "Chicken Parm": total_price = 55;
        break;
        default:
          total_price = 0;
          alert("The platter is un-expected!");
          clearPlatterForm();
          return false;
      }
    }
    else {
      switch(my_platter) {
        case "Garden Salad": total_price = 65;
        break;
        case "Greek Salad": total_price = 75;
        break;
        case "Antipasto": total_price = 75;
        break;
        case "Baked Ziti": total_price = 65;
        break;
        case "Meatball Parm": total_price = 75;
        break;
        case "Chicken Parm": total_price = 85;
        break;
        default:
          total_price = 0;
          alert("The platter is un-expected!");
          clearPlatterForm();
          return false;
      }
    }
    document.getElementById('platter_total_price').innerHTML = "$" + total_price.toString();
    sendPlatterData(platter_form);
    clearPlatterForm();
    console.log('Submited! add to cart a dinner platter');

});

});
