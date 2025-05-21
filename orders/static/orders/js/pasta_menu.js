function sendPastaData(form) {

  const XHR = new XMLHttpRequest();
  // Set up our request
  var csrftoken = getCookie('csrftoken');
  XHR.open("POST", "/order_pasta" );

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

function clearPastaForm() {

  radios = document.getElementsByName('pasta');
  radios.forEach((radio) => { radio.checked = false;
  });

}

document.addEventListener('DOMContentLoaded', () => {


let pasta_form = document.getElementById('form_pasta_order');

//  take over its submit event.
pasta_form.addEventListener("submit", function (event) {

    event.preventDefault();
    let total_price = 0.0;
    let pasta = document.querySelector('input[name="pasta"]:checked');
    if (pasta === null) {
      alert (" please choose one pasta before adding to cart ");
      return false;
    }
    let my_pasta = pasta.value;
    console.log("my shosen pasta is " + my_pasta);
    switch(my_pasta) {
      case "Baked Ziti w/Mozzarella": total_price = 7.0;
      break;
      case "Baked Ziti w/Meatballs": total_price = 9.25;
      break;
      case "Baked Ziti w/Chicken": total_price = 10.25;
      break;
      default:
        total_price = 0;
        alert("The Pasta is un-expected!");
        clearPastaForm();
        return false;
    }
    document.getElementById('pasta_total_price').innerHTML = "$" + total_price.toString();
    sendPastaData(pasta_form);
    clearPastaForm();
    console.log('Submited! add to cart a pasta');

});

});
