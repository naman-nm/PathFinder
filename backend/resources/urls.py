from django.urls import path
from .views import *

urlpatterns = [
    path("", ResourceListView.as_view(), name="resource-list"),
    path("meta/", ResourceMetaView.as_view(), name="resource-meta"),
    path("featured/", FeaturedResourceView.as_view(), name="resource-featured"),
    path("<slug:slug>/download/", ResourceDownloadView.as_view(), name="resource-download"),
    path("<slug:slug>/", ResourceDetailView.as_view(), name="resource-detail"),
    
    # admin login and signup view
    path("login/admin/", AdminLoginView.as_view(), name='admin_login'),
    path("signup/admin/", AdminSignupView.as_view(), name='admin_signup'),
    
    # Admin resource CRUD Operation Views
    path("api/admin/resources/",AdminResourceListCreateView.as_view(),name="admin_resources"),
    path("api/admin/resources/<int:id>/",AdminResourceDetailView.as_view(),name="admin_resource_detail"),
    
    path('get/resources/', GetResourcesView.as_view(), name='get_resources'),
]
