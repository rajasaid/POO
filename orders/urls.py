from django.urls import path

from . import views

urlpatterns = [
    path("login", views.login, name="login"),
    path("logout", views.logout, name="logout"),
    path("my_orders", views.my_orders, name="my_orders"),
    path("my_orders/delete_completed", views.delete_completed, name="delete_completed"),
    path("menu", views.menu, name="menu"),
    path("menu/r_pizza", views.r_pizza_menu, name="r_pizza_menu"),
    path("menu/s_pizza", views.s_pizza_menu, name="s_pizza_menu"),
    path("menu/subs", views.subs_menu, name="subs_menu"),
    path("menu/pasta", views.pasta_menu, name="pasta_menu"),
    path("menu/salad", views.salad_menu, name="salad_menu"),
    path("menu/platter", views.platter_menu, name="platter_menu"),
    path("cart", views.cart, name="cart"),
    path("order_pizza", views.order_pizza, name="order_pizza"),
    path("order_pasta", views.order_pasta, name="order_pasta"),
    path("order_salad", views.order_salad, name="order_salad"),
    path("order_platter", views.order_platter, name="order_platter"),
    path("order_sub", views.order_sub, name="order_sub"),
    path("confirm_order", views.confirm_order, name="confirm_order"),
    path("clear_cart_data", views.clear_cart_data, name="clear_cart_data"),
    path("register", views.register, name="register"),
    path("", views.index, name="index")
]
