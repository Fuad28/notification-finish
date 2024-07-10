
from rest_framework import serializers

from api.models import Notification
from api.enums import NotificationTypeEnum

class NotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        fields = ["id", "user","notification_type", "data", "is_read", "mail", "in_app", "created_at", "updated_at"]

    def validate_notification_type(self, value):
        if value not in NotificationTypeEnum.values:
            raise serializers.ValidationError(
                f"Invalid notification type. Valid options are: {NotificationTypeEnum.values}")
        return value



class CreditNotificationSerializer(serializers.Serializer):
    message= serializers.CharField(max_length= 255)


class DebitNotificationSerializer(serializers.Serializer):
    message= serializers.CharField(max_length= 255)


