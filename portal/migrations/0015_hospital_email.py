# Generated by Django 3.1.4 on 2021-06-03 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0014_auto_20210602_1253'),
    ]

    operations = [
        migrations.AddField(
            model_name='hospital',
            name='email',
            field=models.EmailField(max_length=254, null=True),
        ),
    ]
