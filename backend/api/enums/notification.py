from django.db.models import TextChoices

class NotificationTypeEnum(TextChoices):
    CREDIT= "credit"
    DEBIT= "debit"
