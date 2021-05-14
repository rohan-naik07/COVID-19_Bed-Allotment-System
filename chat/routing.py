from django.conf.urls import url

from .consumers import ChatConsumer

websocket_urlpatterns = [
    url(r'^ws/chat/(?P<room_name>[^/]+)/$', ChatConsumer.as_asgi()),
]
