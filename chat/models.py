import uuid

from django.db import models


# Create your models here.
from django.utils.text import slugify


class Message(models.Model):
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE)
    text = models.TextField()
    sent = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username + ' ' + self.sent.__str__()


class Chat(models.Model):
    participants = models.ForeignKey('authentication.User', blank=True, null=True, on_delete=models.CASCADE)
    hospital = models.ForeignKey('portal.Hospital', null=False, related_name='Hospital', on_delete=models.CASCADE)
    messages = models.ManyToManyField(Message, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(unique=True, max_length=8, null=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(str(uuid.uuid4())[:8])
        super(Chat, self).save(*args, **kwargs)

    def __str__(self):
        return self.hospital.name
