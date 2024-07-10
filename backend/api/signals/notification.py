from django.dispatch import receiver
from django.db.models.signals import post_save

from api.models import Notification
from api.utils.notification import notification_handler

@receiver(post_save, sender= Notification)
def handle_new_notification(sender, **kwargs):

    if kwargs["created"]:
        notification_handler.send_notification(notification= kwargs["instance"])