from django.db import models

# Create your models here.
class RoomMember(models.Model):
    member_name = models.CharField(max_length=255)
    member_uid = models.CharField(max_length=255)
    room_name = models.CharField(max_length=255)

    def __str__(self):
        return self.member_name