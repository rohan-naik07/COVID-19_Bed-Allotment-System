# Generated by Django 3.1.4 on 2021-05-09 12:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0004_hospital_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hospital',
            name='applicants',
        ),
        migrations.AddField(
            model_name='patient',
            name='application',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='portal.hospital'),
        ),
    ]
