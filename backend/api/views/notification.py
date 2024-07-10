from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status

import threading

from api.tasks import long_running_task


class TriggerNotification(APIView):
    """
    Simple API that triggers a 'background' task which sends a notification after it's been completed.
    """

    def post(self, request: Request):
        user_id= request.user.pk
        thread = threading.Thread(target=long_running_task, args= [user_id])
        thread.start()

        return Response({"detail": "processing..."}, status=status.HTTP_200_OK)
    
    