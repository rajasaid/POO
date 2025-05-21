function sendSaladData(form) {

  const XHR = new XMLHttpRequest();
  // Set up our request
  var csrftoken = getCookie('csrftoken');
  XHR.open("POST", "/order_salad" );

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

function clearSaladForm() {

  radios = document.getElementsByName('salad');
  radios.forEach((radio) => { radio.checked = false;
  });

}

document.addEventListener('DOMContentLoaded', () => {


let salad_form = document.getElementById('form_salad_order');

//  take over its submit event.
salad_form.addEventListener("submit", function (event) {

    event.preventDefault();
    let total_price = 0.0;
    let salad = document.querySelector('input[name="salad"]:checked');
    if (salad === null) {
      alert (" please choose one salad before adding to cart ");
      return false;
    }
    let my_salad = salad.value;
    console.log("my shosen salad is " + my_salad);
    switch(my_salad) {
      case "Garden Salad": total_price = 6.75;
      break;
      case "Greek Salad": total_price = 8.75;
      break;
      case "Antipasto": total_price = 8.75;
      break;
      case "Salad w/Tuna": total_price = 8.75;
      break;
      default:
        total_price = 0;
        alert("The salad is un-expected!");
        clearSaladForm();
        return false;
    }
    document.getElementById('salad_total_price').innerHTML = "$" + total_price.toString();
    sendSaladData(salad_form);
    clearSaladForm();
    console.log('Submited! add to cart a salad');

});

});
