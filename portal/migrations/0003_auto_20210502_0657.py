# Generated by Django 3.1.4 on 2021-05-02 06:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('portal', '0002_hospital_review'),
    ]

    operations = [
        migrations.AddField(
            model_name='hospital',
            name='contact',
            field=models.CharField(max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='hospital',
            name='imageUrl',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='hospital',
            name='staff',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='hospital_staff', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='hospital',
            name='available_beds',
            field=models.IntegerField(default=30, null=True),
        ),
        migrations.AlterField(
            model_name='hospital',
            name='latitude',
            field=models.FloatField(default=0.0, null=True),
        ),
        migrations.AlterField(
            model_name='hospital',
            name='longitude',
            field=models.FloatField(default=0.0, null=True),
        ),
        migrations.AlterField(
            model_name='hospital',
            name='name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='hospital',
            name='total_beds',
            field=models.IntegerField(default=30, null=True),
        ),
    ]
