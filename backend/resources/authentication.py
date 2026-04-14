from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from .models import AdminUser

class AdminJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            admin_id = validated_token["admin_id"]
            return AdminUser.objects.get(id=admin_id)
        except (KeyError, AdminUser.DoesNotExist):
            raise InvalidToken("Admin not found")