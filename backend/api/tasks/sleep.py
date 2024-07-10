import time
from random import choice

from api.enums import NotificationTypeEnum
from api.models import Notification

def long_running_task(user_id):
    time.sleep(1)

    print("Long running task completed.")

    notification_type= choice(NotificationTypeEnum.values)

    Notification.objects.create(
        user_id= user_id,
        notification_type= notification_type,
        data= {"message": f"This is a {notification_type} notification"},
        mail = notification_type == NotificationTypeEnum.CREDIT,
        in_app= True
    )

    print("Notification created.")