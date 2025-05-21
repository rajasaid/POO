

document.addEventListener('DOMContentLoaded', () => {


let form = document.getElementById('form_r_pizza_order');

//  take over its submit event.
form.addEventListener("submit", function (event) {
    items = ValidateToppSelection('topping');
    if (items <= 5 && items >= 0) {
      event.preventDefault();
      let total_price = 0.0;
      if (items <= 4) {
        if (document.getElementById('small').checked === true) {
          total_price = 13.25 + items;
          if ((items === 2) || (items === 3)) { total_price +=0.5;}
          if (items === 4) total_price = 18.30;
        }
        else if (document.getElementById('large').checked === true) {
          total_price = 18.75 + 2*items;
        }
      }
      else if (items === 5) {
        if (document.getElementById('small').checked === true) {
          total_price = 18.30;
        }
        else if (document.getElementById('large').checked === true) {
          total_price = 26.75;
        }
      }
      document.getElementById('r_pizza_total_price').innerHTML = "$" + total_price.toString();
      sendData(form, 'regular');
      clearForm('topping');
      console.log('Submited! add to cart r-pizza');
    }
});

});
