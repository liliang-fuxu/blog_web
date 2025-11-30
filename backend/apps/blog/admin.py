from django.contrib import admin
from .models import Category, Tag, Post, Comment, Like, View


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'status', 'is_featured', 'views_count', 'likes_count', 'created_at')
    list_filter = ('status', 'is_featured', 'category', 'tags', 'created_at')
    search_fields = ('title', 'content', 'excerpt')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('基本信息', {
            'fields': ('title', 'slug', 'author', 'status', 'is_featured')
        }),
        ('内容', {
            'fields': ('content', 'excerpt', 'featured_image')
        }),
        ('分类和标签', {
            'fields': ('category', 'tags')
        }),
        ('统计信息', {
            'fields': ('views_count', 'likes_count'),
            'classes': ('collapse',)
        }),
        ('时间信息', {
            'fields': ('created_at', 'updated_at', 'published_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('views_count', 'likes_count', 'created_at', 'updated_at')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'author', 'content_preview', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('content', 'author__username', 'post__title')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = '评论内容'


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('post__title', 'user__username')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)


@admin.register(View)
class ViewAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'ip_address', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('post__title', 'user__username', 'ip_address')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)