from django.db import models
#from django.contrib.auth.models import AbstractBaseUser

# Create your models here.
#class MyUser(AbstractBaseUser):

#    is_staff = models.BooleanField(default=False)
#    username = models.CharField(max_length=40, unique=True)

#    USERNAME_FIELD = 'username'


class Topping(models.Model):

    name = models.CharField(max_length=64)

    def __str__(self):
        return '%s' % (self.name)

class SubTopping(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return '%s' % (self.name)

class Sub(models.Model):

    name = models.CharField(max_length=64)
    price_s = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    price_l = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)

    def __str__(self):
        return '%s' % (self.name)


class OrdSub(models.Model):

    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    extras = models.ManyToManyField(SubTopping, blank=True)
    extra_cheese = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.name)


class Pizza(models.Model):

    TYPES = (
        ('R', 'Regular'),
        ('S', 'Sicilian'),
    )

    type = models.CharField(max_length = 1, choices = TYPES)
    toppings = models.ManyToManyField(Topping, blank=True)
    name = models.CharField(max_length=64, blank=True)
    price_s = models.DecimalField(max_digits=5, decimal_places=2,default=0.0)
    price_l = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return '%s' % (self.name)

class Pasta(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return '%s' % (self.name)

class OrdPasta(models.Model):
    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return '%s' % (self.name)

class DinnerPlatter(models.Model):

    name = models.CharField(max_length=64)
    price_s = models.DecimalField(max_digits=5, decimal_places=2,default=0.0)
    price_l = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return '%s' % (self.name)

class OrdDinnerPlatter(models.Model):

    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return '%s' % (self.name)

class Salad(models.Model):

    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return '%s' % (self.name)

class OrdSalad(models.Model):

    name = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return '%s' % (self.name)

class CartOrder(models.Model):

    STATUS = (
        ('P', 'Pending'),
        ('R', 'Ready'),
    )

    name = models.CharField(max_length=256)
    pizza = models.ForeignKey(Pizza, on_delete=models.CASCADE, null=True, blank=True)
    sub = models.ForeignKey(OrdSub, on_delete=models.CASCADE, null=True, blank=True)
    salad = models.ForeignKey(OrdSalad, on_delete=models.CASCADE, null=True, blank=True)
    pasta = models.ForeignKey(OrdPasta, on_delete=models.CASCADE, null=True, blank=True)
    platter = models.ForeignKey(OrdDinnerPlatter, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length = 1, choices = STATUS)
    username = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return '%s' % (self.name)

class Order(models.Model):

    name = models.CharField(max_length=256)
    cart_orders = models.ManyToManyField(CartOrder)
    username = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return '%s' % (self.name)
