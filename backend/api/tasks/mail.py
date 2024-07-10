from django.core.mail import BadHeaderError

import os
import requests
from templated_mail.mail import BaseEmailMessage

def send_email(recipients, template_name, data= {}, files= []):

    try:
        msg= BaseEmailMessage(template_name= template_name, context= data)
        msg.send(to= recipients)

    except BadHeaderError:
        # log error
        print("BadheaderErrorrr....")