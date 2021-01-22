from django.db import models


# Create your models here.
class Message(models.Model):
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE)
    text = models.TextField()
    sent = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username + ' ' + self.sent.__str__()


class Chat(models.Model):
    participants = models.ManyToManyField('authentication.User', blank=True)
    messages = models.ManyToManyField(Message, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.pk
