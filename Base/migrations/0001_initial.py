# Generated by Django 4.1 on 2022-08-04 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RoomMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('member_name', models.CharField(max_length=255)),
                ('member_uid', models.CharField(max_length=255)),
                ('room_name', models.CharField(max_length=255)),
            ],
        ),
    ]