
from django.db import models
from django.contrib.auth import get_user_model

from api.enums import NotificationTypeEnum

User= get_user_model()

class Notification(models.Model):
    user= models.ForeignKey(User, on_delete= models.CASCADE, related_name= "notifications")
    notification_type= models.CharField(max_length= 50, choices= NotificationTypeEnum.choices)
    data= models.JSONField(null= True)
    is_read= models.BooleanField(default= False)
    mail= models.BooleanField(default= False)
    in_app= models.BooleanField(default= False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user}-{self.notification_type}-{self.created_at}"