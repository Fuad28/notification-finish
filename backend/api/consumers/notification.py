import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from api.models import Notification
from api.serializers.notification import NotificationSerializer

@database_sync_to_async
def get_unread_notifications(user_id):
    notifications = Notification.objects.filter(user_id= user_id, is_read= False)
    serializer=  NotificationSerializer(notifications, many= True)

    return {
        "count": notifications.count(),
        "notifications": serializer.data
    }


@database_sync_to_async
def mark_notification_read(user_id, notification_id):
    notification = Notification.objects.filter(
        id= notification_id, 
        user_id= user_id
    ).first()

    if notification:
        notification.is_read = True
        notification.save()


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        
        await self.accept()
        
        self.user_id= self.scope["user"].id
        self.group_name= f"{self.user_id}_notifications"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        notifications= await get_unread_notifications(self.user_id)
        data= {
            "type": "all_messages",
            "data": {
                "count": notifications["count"],
                "notifications": notifications["notifications"]
            }
        }

        return await self.channel_layer.group_send(
            self.group_name, 
            {"type": "send.message", "data": data}
        )


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type= data.get("type")

        if event_type == "notification.read":
             return await self.notification_read(data.get("id"))
        
        return await self.send_error_message()

           
        

    async def send_error_message(self):
        return await self.send(text_data= json.dumps({"type": "error", "data": {"message": "invalid payload"}}))

    async def send_message(self, event):
        return await self.send(text_data= json.dumps(event["data"]))
    
    async def notification_read(self, id):
        return await mark_notification_read(self.user_id, id)


