
document.addEventListener('DOMContentLoaded', () => {


let form = document.getElementById('form_s_pizza_order');

//  take over its submit event.
form.addEventListener("submit", function (event) {
    items = ValidateToppSelection('s-topping');
    if (items <= 5 && items >= 0) {
      event.preventDefault();
      let total_price = 0.0;
      if (items < 4) {
        if (document.getElementById('small').checked === true) {
          total_price = 25.25 + 2*items;
          if (items === 2) { total_price +=0.5; }
        }
        else if (document.getElementById('large').checked === true) {
          total_price = 39.70 + 2*items;
        }
      }
      else if (items === 5 || items == 4) {
        if (document.getElementById('small').checked === true) {
          total_price = 32.25;
        }
        else if (document.getElementById('large').checked === true) {
          total_price = 46.70;
        }
      }
      document.getElementById('s_pizza_total_price').innerHTML = "$" + total_price.toString();
      sendData(form, 'sicilian');
      clearForm('s-topping');
      console.log('Submited! add to cart s-pizza');
    }
});

});
