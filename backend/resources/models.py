from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password

class Resource(models.Model):

    class Category(models.TextChoices):
        FRAMEWORK = "framework", "Framework"
        PLAYBOOK = "playbook", "Playbook"
        MARKET_MAP = "market_map", "Market Map"
        CASE_STUDY = "case_study", "Case Study"
        TOOL = "tool", "Tool"
        BLOG = "blog", "Orbit Blog"

    class ResourceType(models.TextChoices):
        PDF = "pdf", "PDF"
        VIDEO = "video", "Video"
        TEMPLATE = "template", "Template"
        ARTICLE = "article", "Article"

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    summary = models.TextField()
    description = models.TextField()
    category = models.CharField(max_length=32, choices=Category.choices)
    resource_type = models.CharField(max_length=20, choices=ResourceType.choices)
    read_time = models.CharField(max_length=50, blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]

    def __str__(self):
        return self.title


class AdminUser(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def save(self, *args, **kwargs):
        # hash password before saving
        if not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.email