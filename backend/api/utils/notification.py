from api.tasks.mail import send_email

import threading

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from api.models import Notification
from api.serializers.notification import (CreditNotificationSerializer, DebitNotificationSerializer)

SERIALIZERS= {
		"credit": CreditNotificationSerializer,
		"debit": DebitNotificationSerializer
	}

TEMPLATE_NAMES= {
		"credit": "emails/credit.html",
		"debit": "emails/debit.html",
	
	}

class NotificationHandler:
	""" Handles both in app and mail user notifications. """

	def _validate_data(self, notification: Notification):
		template_name= TEMPLATE_NAMES[notification.notification_type]
		serializer= SERIALIZERS[notification.notification_type](data= notification.data)
		serializer.is_valid(raise_exception= True)

		return serializer.validated_data, template_name
	
	def send_mail(self, notification: Notification):
		data, template_name= self._validate_data(notification)
		recipient= [notification.user.email]

		thread = threading.Thread(target=send_email, args= [recipient, template_name, data])
		thread.start()


	def send_in_app(self, notification: Notification):
		data, _= self._validate_data(notification)
		group_name= f"{notification.user.pk}_notifications"
		async_to_sync(get_channel_layer().group_send)(
			group_name, 
			{"type": "send.message", "message": data["message"]})


	def send_notification(self, notification: Notification):
		if notification.mail:
			self.send_mail(notification)
		
		if notification.in_app:
			self.send_in_app(notification)

notification_handler= NotificationHandler()