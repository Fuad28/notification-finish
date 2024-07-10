from djoser.views import UserViewSet as DjoserUserViewset

class UserViewSet(DjoserUserViewset):
	
	def create(self, request, *args, **kwargs):
		""" Cast emails into all lower case. """
		
		if "email" in request.data:
			request.data["email"]= request.data["email"].lower()
		return super().create(request, *args, **kwargs)
