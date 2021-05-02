# Generated by Django 3.1.4 on 2021-05-02 06:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('portal', '0003_auto_20210502_0657'),
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('sent', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('p2p', models.BooleanField(default=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('hospital', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Hospital', to='portal.hospital')),
                ('messages', models.ManyToManyField(blank=True, to='chat.Message')),
                ('participants', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
