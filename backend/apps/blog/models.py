from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.urls import reverse
from django.utils.text import slugify

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='分类名称')
    slug = models.SlugField(max_length=100, unique=True, blank=True, verbose_name='URL别名')
    description = models.TextField(blank=True, verbose_name='描述')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    
    class Meta:
        verbose_name = '分类'
        verbose_name_plural = '分类'
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name='标签名称')
    slug = models.SlugField(max_length=50, unique=True, blank=True, verbose_name='URL别名')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    
    class Meta:
        verbose_name = '标签'
        verbose_name_plural = '标签'
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class Post(models.Model):
    STATUS_CHOICES = (
        ('draft', '草稿'),
        ('published', '已发布'),
        ('archived', '已归档'),
    )
    
    title = models.CharField(max_length=200, verbose_name='标题')
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name='URL别名')
    content = models.TextField(verbose_name='内容')
    excerpt = models.TextField(max_length=300, blank=True, verbose_name='摘要')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts', verbose_name='作者')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts', verbose_name='分类')
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts', verbose_name='标签')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft', verbose_name='状态')
    featured_image = models.ImageField(upload_to='posts/', null=True, blank=True, verbose_name='特色图片')
    views_count = models.PositiveIntegerField(default=0, verbose_name='浏览次数')
    likes_count = models.PositiveIntegerField(default=0, verbose_name='点赞次数')
    is_featured = models.BooleanField(default=False, verbose_name='是否推荐')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    published_at = models.DateTimeField(null=True, blank=True, verbose_name='发布时间')
    
    class Meta:
        verbose_name = '文章'
        verbose_name_plural = '文章'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return f'/blog/{self.slug}/'
    
    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments', verbose_name='文章')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments', verbose_name='作者')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies', verbose_name='父评论')
    content = models.TextField(verbose_name='内容')
    is_approved = models.BooleanField(default=True, verbose_name='是否已审核')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    class Meta:
        verbose_name = '评论'
        verbose_name_plural = '评论'
        ordering = ['created_at']
    
    def __str__(self):
        return f'{self.author.username} 在 {self.post.title} 的评论'


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes', verbose_name='文章')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_posts', verbose_name='用户')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    
    class Meta:
        verbose_name = '点赞'
        verbose_name_plural = '点赞'
        unique_together = ['post', 'user']
    
    def __str__(self):
        return f'{self.user.username} 点赞了 {self.post.title}'


class View(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='views', verbose_name='文章')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='用户')
    ip_address = models.GenericIPAddressField(verbose_name='IP地址')
    user_agent = models.TextField(blank=True, verbose_name='用户代理')
    created_at = models.DateTimeField(default=timezone.now, verbose_name='创建时间')
    
    class Meta:
        verbose_name = '浏览记录'
        verbose_name_plural = '浏览记录'
        ordering = ['-created_at']
    
    def __str__(self):
        user_str = self.user.username if self.user else '匿名用户'
        return f'{user_str} 浏览了 {self.post.title}'