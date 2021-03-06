# Generated by Django 3.1.4 on 2021-05-31 11:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0010_hospital_required_documents'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='is_first_dose',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='patient',
            name='is_second_dose',
            field=models.BooleanField(default=False),
        ),
    ]
