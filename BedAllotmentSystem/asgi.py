"""
ASGI config for BedAllotmentSystem project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BedAllotmentSystem.settings')
django.setup()
default_asgi = get_asgi_application()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from chat import routing

application = ProtocolTypeRouter({
    'http': default_asgi,
    'websocket': AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns
        )
    ),
})
