from django.db.models import Q
from django.http import FileResponse, Http404, HttpResponseRedirect
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Resource
from .serializers import *
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from .authentication import AdminJWTAuthentication
class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return

class PublishedResourceQuerysetMixin:
    def get_base_queryset(self):
        return (
            Resource.objects.filter(is_published=True)
            .prefetch_related("related_resources")
            .order_by("-is_featured", "-published_at", "title")
        )


class ResourceListView(PublishedResourceQuerysetMixin, generics.ListAPIView):
    serializer_class = ResourceListSerializer

    def get_queryset(self):
        queryset = self.get_base_queryset()

        category = self.request.query_params.get("category")
        resource_type = self.request.query_params.get("resource_type")
        template = self.request.query_params.get("template")
        search = self.request.query_params.get("search")
        featured = self.request.query_params.get("featured")

        if category:
            queryset = queryset.filter(category=category)
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        if template:
            queryset = queryset.filter(content_template=template)
        if featured in {"1", "true", "True"}:
            queryset = queryset.filter(is_featured=True)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(summary__icontains=search)
                | Q(description__icontains=search)
                | Q(tags__icontains=search)
            )

        return queryset


class ResourceDetailView(PublishedResourceQuerysetMixin, generics.RetrieveAPIView):
    serializer_class = ResourceDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return self.get_base_queryset()


class FeaturedResourceView(PublishedResourceQuerysetMixin, generics.RetrieveAPIView):
    serializer_class = ResourceDetailSerializer

    def get_object(self):
        featured = self.get_base_queryset().filter(is_featured=True).first()
        if not featured:
            raise Http404("No featured resource has been published.")
        return featured


class ResourceMetaView(PublishedResourceQuerysetMixin, APIView):
    def get(self, request):
        queryset = self.get_base_queryset()
        categories = {
            choice[0]: queryset.filter(category=choice[0]).count()
            for choice in Resource.Category.choices
        }
        payload = {
            "total": queryset.count(),
            "featured": queryset.filter(is_featured=True).count(),
            "counts": categories,
            "templates": {
                choice[0]: queryset.filter(content_template=choice[0]).count()
                for choice in Resource.ContentTemplate.choices
            },
        }
        return Response(payload)


class ResourceDownloadView(PublishedResourceQuerysetMixin, APIView):
    def get(self, request, slug):
        resource = generics.get_object_or_404(self.get_base_queryset(), slug=slug)

        if resource.download_file:
            filename = resource.download_file.name.split("/")[-1]
            return FileResponse(
                resource.download_file.open("rb"),
                as_attachment=True,
                filename=filename,
            )

        if resource.external_url:
            return HttpResponseRedirect(resource.external_url)

        raise Http404("No downloadable asset is attached to this resource.")


class AdminSignupView(APIView):

    def post(self, request):

        serializer = AdminSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Admin account created successfully"
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class AdminLoginView(APIView):

    def post(self, request):

        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():

            user = serializer.validated_data["user"]
            refresh = RefreshToken()
            refresh["user_id"] = user.id
            refresh["admin_id"] = user.id
            refresh["email"] = user.email

            return Response({

                "message": "Login successful",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "admin": {
                    "id": user.id,
                    "email": user.email,
                }
            })

        return Response(serializer.errors, status=400)
    
class AdminResourceListCreateView(APIView):

    authentication_classes = [AdminJWTAuthentication, CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]


    def get(self, request):

        resources = Resource.objects.all()
        serializer = ResourceListSerializer(
            resources,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)


    def post(self, request):

        serializer = ResourceWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
          
class AdminResourceDetailView(APIView):
    authentication_classes = [AdminJWTAuthentication, CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        try:
            return Resource.objects.get(id=id)
        except Resource.DoesNotExist:
            return None


    def patch(self, request, id):

        resource = self.get_object(id)
        if not resource:

            return Response(
                {"error": "Resource not found"},
                status=404
            )

        serializer = ResourceWriteSerializer(
            resource,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


    def delete(self, request, id):

        resource = self.get_object(id)
        if not resource:
            return Response(
                {"error": "Resource not found"},
                status=404
            )
        resource.delete()

        return Response(
            {"message": "Resource deleted"},
            status=204
        )
        
class GetResourcesView(APIView):
    
    def get(self, request):

        resources = Resource.objects.all()
        serializer = ResourceListSerializer(
            resources,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)