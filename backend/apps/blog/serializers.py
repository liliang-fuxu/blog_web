from rest_framework import serializers
from .models import Category, Tag, Post, Comment, Like, View


class CategorySerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'posts_count', 'created_at')
        read_only_fields = ('slug', 'created_at')
    
    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class TagSerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ('id', 'name', 'slug', 'posts_count', 'created_at')
        read_only_fields = ('slug', 'created_at')
    
    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = 'users.User'
        fields = ('id', 'username', 'first_name', 'last_name', 'avatar')
        read_only_fields = ('id',)


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ('id', 'post', 'author', 'parent', 'content', 'is_approved', 'created_at', 'updated_at', 'replies')
        read_only_fields = ('author', 'created_at', 'updated_at')
    
    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.filter(is_approved=True), many=True).data
        return []


class PostListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ('id', 'title', 'slug', 'excerpt', 'author', 'category', 'tags', 
                 'featured_image', 'views_count', 'likes_count', 'is_featured', 
                 'created_at', 'published_at', 'comments_count')
    
    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class PostDetailSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ('id', 'title', 'slug', 'content', 'excerpt', 'author', 'category', 
                 'tags', 'status', 'featured_image', 'views_count', 'likes_count', 
                 'is_featured', 'created_at', 'updated_at', 'published_at', 
                 'comments', 'is_liked')
        read_only_fields = ('author', 'views_count', 'likes_count', 'created_at', 'updated_at')
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('title', 'content', 'excerpt', 'category', 'tags', 'status', 
                 'featured_image', 'is_featured')
    
    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        post = Post.objects.create(**validated_data)
        post.tags.set(tags_data)
        return post
    
    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if tags_data is not None:
            instance.tags.set(tags_data)
        
        return instance


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('id', 'post', 'created_at')
        read_only_fields = ('created_at',)


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('post', 'parent', 'content')
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)