from django.contrib import admin

# Register your models here.
from .models import Topping, Pizza, Sub, Order, Pasta, Salad, DinnerPlatter, SubTopping


admin.site.register(Topping)
admin.site.register(SubTopping)
admin.site.register(Pizza)
admin.site.register(Sub)
admin.site.register(Order)
admin.site.register(Pasta)
admin.site.register(Salad)
admin.site.register(DinnerPlatter)
