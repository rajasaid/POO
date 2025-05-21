from django.http import HttpResponse, JsonResponse
from django.template import RequestContext
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_protect
from .models import Topping, SubTopping, Pizza, Sub, OrdSub, CartOrder, Order, Pasta, OrdPasta, Salad, OrdSalad, DinnerPlatter, OrdDinnerPlatter

# cart data , a map of pizzas to username
shopCart = {}

# Create your views here.
@csrf_protect
def index(request):
    return render(request,"orders/index.html")

@csrf_protect
def delete_completed(request):
    username = request.user.username
    userObj = User.objects.get(username=username)
    if userObj.is_staff == False:
        my_orders = Order.objects.filter(username__in = [username, ' ' + username, username + ' '])
        for my_order in my_orders:
            if (my_order.completed == True):
                for ord in my_order.cart_orders.all():
                    ord.delete()
                my_order.delete()
        context = {
            "orders" : Order.objects.filter(username__in =[username, ' ' + username, username + ' ']),
            "user" : userObj,
        }
    else:
        # remove all completed orders
        orders = Order.objects.filter(completed = True);
        for order in orders:
            for ord in order.cart_orders.all():
                ord.delete()
            order.delete()
        context = {
            "orders" : Order.objects.all(),
            "user" : userObj,
        }

    return render(request,"orders/my_orders.html", context)



@csrf_protect
def my_orders(request):
    #if request.method == "POST":
    #username = request.POST.get("username")
    username = request.user.username
    # if user is staff return all orders
    userObj = User.objects.get(username=username)
    if userObj.is_staff == True:
        context = {
            "orders" : Order.objects.all(),
            "user" : userObj,
        }
    else:
        context = {
            "orders" : Order.objects.filter(username__in =[username, ' ' + username, username + ' ']),
            "user" : userObj,
        }
    return render(request,"orders/my_orders.html", context)

@csrf_protect
def clear_cart_data(request):
    if request.is_ajax() and request.method == "POST":
        idStr = request.POST.get("oid")
        username = request.POST.get('username')
        id = int(idStr)
        CartOrder.objects.get(pk=id).delete()
        # remove from list of shopcart in memory
        list = shopCart[username]
        for dict in list:
            if dict['oid'] == id:
                # print(f" {dict} is removed from memory")
                list.remove(dict)

        return JsonResponse({"success": True})

    else:
        return JsonResponse({"success": False})


@csrf_protect
def order_platter(request):
    if request.is_ajax() and request.method == "POST":

        myplatter = request.POST.get("platter")
        mysize = request.POST.get("size")
        myuser = request.POST.get("username")

        menu_platter = DinnerPlatter.objects.get(name=myplatter)

        if mysize == 'small':
            price = menu_platter.price_s
        else:
            price = menu_platter.price_l

        newPlatter = OrdDinnerPlatter(name=myplatter, price=price)
        newPlatter.save()
        name = myplatter + " DinnerPlatter"
        newOrder = CartOrder(status='P', username=myuser, price=price, platter= newPlatter, name=name)
        newOrder.save()
        oId = newOrder.id
        topps = []

        newData = {}
        newData['name'] ='DinnerPlatter'
        newData['type'] = myplatter
        newData['size'] = mysize
        newData['price'] = price
        newData['oid'] = oId
        newData['topps'] = topps

        if myuser not in shopCart:
            shopCart[myuser] = []
        shopCart[myuser].append(newData)
        return JsonResponse({"success": True, "name": 'DinnerPlatter', "type": myplatter, "size" : mysize, "topps": topps, "price": price, "oid" : oId})

    return HttpResponse("DinnerPlatter order!!")



@csrf_protect
def order_salad(request):
    if request.is_ajax() and request.method == "POST":

        mysalad = request.POST.get("salad")
        myuser = request.POST.get("username")

        menu_salad = Salad.objects.get(name=mysalad)
        price=menu_salad.price
        newSalad = OrdSalad(name=mysalad, price=price)
        newSalad.save()
        name = mysalad + " Salad"
        newOrder = CartOrder(status='P', username=myuser, price=price, salad = newSalad, name=name)
        newOrder.save()
        oId = newOrder.id
        topps = []

        newData = {}
        newData['name'] ='Salad'
        newData['type'] = mysalad
        newData['size'] = 'regular'
        newData['price'] = price
        newData['oid'] = oId
        newData['topps'] = topps

        if myuser not in shopCart:
            shopCart[myuser] = []
        shopCart[myuser].append(newData)
        return JsonResponse({"success": True, "name": 'Salad', "type": mysalad, "size" : 'regular', "topps": topps, "price": price, "oid" : oId})

    return HttpResponse("Salad order!!")



@csrf_protect
def order_pasta(request):
    if request.is_ajax() and request.method == "POST":
        mypasta = request.POST.get("pasta")
        myuser = request.POST.get("username")

        menu_pasta = Pasta.objects.get(name=mypasta)

        price = menu_pasta.price
        newPasta = OrdPasta(name=mypasta, price=price )
        newPasta.save()
        name = mypasta + " Pasta"

        newOrder = CartOrder(status='P', username=myuser, price=price, pasta = newPasta, name=name)
        newOrder.save()
        oId = newOrder.id
        topps = []

        newData = {}
        newData['name'] ='Pasta'
        newData['type'] = mypasta
        newData['size'] = 'regular'
        newData['price'] = price
        newData['oid'] = oId
        newData['topps'] = topps

        if myuser not in shopCart:
            shopCart[myuser] = []
        shopCart[myuser].append(newData)
        return JsonResponse({"success": True, "name": 'Pasta', "type": mypasta, "size" : 'regular', "topps": topps, "price": price, "oid" : oId})

    return HttpResponse("Pasta order!!")


@csrf_protect
def order_sub(request):
    if request.is_ajax() and request.method == "POST":

        mysub = request.POST.get("subs")
        mysize = request.POST.get('size')
        myuser = request.POST.get("username")
        extras = request.POST.getlist('sub-topping')
        extra_cheese = request.POST.getlist("extra_cheese")

        cnt = 0
        price = 0
        extra_tops = len(extras)
        price += 0.5*extra_tops
        cnt = len(extra_cheese)
        if cnt == 0:
            extra_c = False
        else:
            extra_c = True
            price+=0.5

        menu_sub = Sub.objects.get(name=mysub)

        if mysize == 'small':
            price += float(menu_sub.price_s)
        else:
            price += float(menu_sub.price_l)

        newSub = OrdSub(name=mysub,extra_cheese=extra_c,price=price)
        newSub.save()

        name = mysub + " Sub: "
        subtops = SubTopping.objects.all()
        for subtop in subtops:
            for top in extras:
                if top == subtop.__str__():
                    newSub.extras.add(subtop)
                    name += top + ","

        if extra_c == True:
            name += "extra cheese"
        newOrder = CartOrder(status='P', username=myuser, price=price, sub = newSub, name=name)
        newOrder.save()
        oId = newOrder.id

        newData = {}
        newData['name'] ='Sub'
        newData['type'] = mysub
        newData['size'] = mysize
        newData['price'] = price
        newData['oid'] = oId
        newData['topps'] = extras
        if extra_c == True:
            extras.append('extra cheese')
        if myuser not in shopCart:
            shopCart[myuser] = []
        shopCart[myuser].append(newData)
        return JsonResponse({"success": True, "name": 'Sub', "type": mysub, "size" : mysize, "price": price, "topps": extras, "oid" : oId})

        #print(f"myuser is {myuser} mysize is {mysize} mytype is {mytype}")
    return HttpResponse("Sub order!!")


@csrf_protect
def order_pizza(request):
    if request.is_ajax() and request.method == "POST":
        topps = Topping.objects.all()

        #  print(f"mytop is {mytop}")
        mysize = request.POST.get('size')
        mytype = request.POST.get('type')
        myuser = request.POST.get("username")


        if mytype == "regular":
            mytops = request.POST.getlist('topping')
            if (len(mytops) > 3):
                myprice_l = 26.75
                myprice_s = 18.30
            else:
                myprice_l = 18.75
                myprice_s = 13.25
                if len(mytops) == 1:
                    myprice_l +=2
                    myprice_s +=1
                elif len(mytops) == 2:
                    myprice_l += 4
                    myprice_s += 2.5
                elif len(mytops) == 3:
                    myprice_l += 6
                    myprice_s += 3.5

            type = 'R'
            mtype= 'Regular'
        else:
            mytops = request.POST.getlist('s-topping')
            if (len(mytops) > 3):
                myprice_l = 46.70
                myprice_s = 32.25
            else:
                myprice_l = 39.70
                myprice_s = 25.25
                if len(mytops) == 1:
                    myprice_l +=2
                    myprice_s +=2
                elif len(mytops) == 2:
                    myprice_l += 4
                    myprice_s += 4.5
                elif len(mytops) == 3:
                    myprice_l += 6
                    myprice_s += 6

            type = 'S'
            mtype='Sicilian'

        toppstr = ''
        for t in mytops:
            toppstr += t + ','

        if mysize == "large":
            name = "Large " + mtype + ' Pizza: ' + toppstr
            newPizza = Pizza(type = type, price_l = myprice_l, price_s = 0.0, name = name )
            order_price=myprice_l
        else:
            name = "Small " + mtype + ' Pizza: ' + toppstr
            newPizza = Pizza(type = type, price_l = 0.0, price_s = myprice_s, name = name )
            order_price=myprice_s

        newPizza.save()
        for topping in mytops:
            for topp in topps:
                if topp.__str__() == topping:
                    newPizza.toppings.add(topp)


        newOrder = CartOrder(status='P', username=myuser, price=order_price, pizza = newPizza, name=name)
        newOrder.save()
        oId = newOrder.id

        newData = {}
        newData['name'] ='Pizza'
        newData['size'] = mysize
        newData['type'] = mytype
        newData['price'] = order_price
        newData['oid'] = oId
        newData['topps'] = mytops


        if myuser not in shopCart:
            shopCart[myuser] = []
        shopCart[myuser].append(newData)
        return JsonResponse({"success": True, "name": 'Pizza', "size" : mysize, "type": mytype, "price": order_price, "topps": mytops, "oid" : oId})

        #print(f"myuser is {myuser} mysize is {mysize} mytype is {mytype}")
    return HttpResponse("pizza order!!")

@csrf_protect
def confirm_order(request):
    if request.is_ajax() and request.method == "POST":
        # idsStr = request.POST.get('strOfIds')
        username = request.POST.get('username')
        # empty list of shopcart in memory
        orders = shopCart[username]
        order_price = 0
        list = []
        name = ''
        for order in orders:
            ord = CartOrder.objects.get(pk=order['oid'])
            ord.status = 'R'
            name += ord.name + ' + '
            order_price += ord.price
            list.append(ord)

        name = name[:-1]
        name = name[:-1]
        shopCart[username] = []

        newOrder = Order(completed= False, username=username, price=order_price, name=name)
        newOrder.save()
        for ord in list:
            newOrder.cart_orders.add(ord)
        return JsonResponse({"success": True})
    return JsonResponse({"success": False})

## return cart data for the username saved in the server memory
@csrf_protect
def cart(request):
    if request.is_ajax() and request.method == "POST":
        username = request.POST.get('username')
        #print(f"shopcart is {shopCart}")
        myCart = []
        if username in shopCart:
            myCart = shopCart[username]
        return JsonResponse({"success": True, "cart": myCart})
    else:
        return HttpResponse("error reading cart data")


@csrf_protect
def menu(request):
    username = request.user.username
    context = {
        "toppings" : Topping.objects.all(),
        "subs" : Sub.objects.all(),
        "pastas": Pasta.objects.all(),
        "salads": Salad.objects.all(),
        "platters": DinnerPlatter.objects.all(),
        "username": username
    }
    return render(request, "orders/menu.html", context)

@csrf_protect
def platter_menu(request):
    username = request.user.username
    context = {
        "platters": DinnerPlatter.objects.all(),
        "username": username
    }
    return render(request, "orders/platter_menu.html", context)

@csrf_protect
def salad_menu(request):
    username = request.user.username
    context = {
        "salads" : Salad.objects.all(),
        "username": username
    }
    return render(request, "orders/salad_menu.html", context)

@csrf_protect
def pasta_menu(request):
    username = request.user.username
    context = {
        "pastas" : Pasta.objects.all(),
        "username": username
    }
    return render(request, "orders/pasta_menu.html", context)

@csrf_protect
def subs_menu(request):
    username = request.user.username
    context = {
        "subs" : Sub.objects.all(),
        "toppings" : SubTopping.objects.all(),
        "username": username
    }
    return render(request, "orders/subs.html", context)


@csrf_protect
def r_pizza_menu(request):
    username = request.user.username
    context = {
        "toppings" : Topping.objects.all(),
        "username": username
    }
    return render(request, "orders/r_pizza_menu.html", context)

@csrf_protect
def s_pizza_menu(request):
    username = request.user.username
    context = {
        "toppings" : Topping.objects.all(),
        "username": username
    }
    return render(request, "orders/s_pizza_menu.html", context)


# main view for the registeration of users
@csrf_protect
def register(request):

    if request.user.is_authenticated:
        return menu(request)

    if request.method == 'POST':

        username = request.POST.get("username")
        password = request.POST.get("password")
        email = request.POST.get("email")
        firstname = request.POST.get("firstname")
        lastname = request.POST.get("lastname")

        userObj = User.objects.filter(username=username)
        if userObj.exists():
            return render(request,"orders/register_invalid_username.html")
        emailObj = User.objects.filter(email=email)
        if emailObj.exists():
            return render(request,"orders/register_invalid_email.html")
        newUser = User.objects.create_user(username, email, password, first_name=firstname, last_name=lastname, is_staff=False)
        if newUser is not None:
            newUser.save()
            myUser = authenticate(request, username=username, password=password)
            auth_login(request, myUser)
            # render main menu page

            return menu(request) #render(request, "orders/menu.html", context)
        else:
            return HttpResponse("error creating newUser")

@csrf_protect
def login(request):

    if request.user.is_authenticated:
        return menu(request)

    if request.method == 'POST':
        username = request.POST.get("username")
        password = request.POST.get("password")
        myUser = authenticate(request, username=username, password=password)
        if myUser is not None:
            auth_login(request, myUser)
            return menu(request) #render(request, "orders/menu.html", context)
        else:
            return render(request,"orders/error_login.html")


@csrf_protect
def logout(request):
    auth_logout(request)
    return redirect('index')
