from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Post, Category, Tag, Comment, Like, View
from .serializers import (
    PostListSerializer, PostDetailSerializer, PostCreateUpdateSerializer,
    CategorySerializer, TagSerializer, CommentSerializer, CommentCreateSerializer,
    LikeSerializer
)


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TagListCreateView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class TagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PostListView(generics.ListAPIView):
    queryset = Post.objects.filter(status='published')
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'tags', 'author', 'is_featured']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'published_at', 'views_count', 'likes_count']
    ordering = ['-created_at']


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.filter(status='published')
    serializer_class = PostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # 记录浏览
        ip_address = self.get_client_ip(request)
        user = request.user if request.user.is_authenticated else None
        
        View.objects.get_or_create(
            post=instance,
            user=user,
            ip_address=ip_address,
            defaults={
                'user_agent': request.META.get('HTTP_USER_AGENT', '')[:255]
            }
        )
        
        # 更新浏览次数
        Post.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        instance.views_count += 1
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            # 只有作者或管理员可以编辑
            obj = self.get_object()
            if obj.author == self.request.user or self.request.user.is_staff:
                return [permissions.IsAuthenticated()]
            else:
                return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, *args, **kwargs):
        obj = self.get_object()
        if obj.author == request.user or request.user.is_staff:
            return super().delete(request, *args, **kwargs)
        else:
            return Response(
                {'error': '您没有权限删除此文章'}, 
                status=status.HTTP_403_FORBIDDEN
            )


class MyPostListView(generics.ListAPIView):
    serializer_class = PostListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'is_featured']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'updated_at', 'views_count', 'likes_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_post(request, slug):
    post = get_object_or_404(Post, slug=slug, status='published')
    like, created = Like.objects.get_or_create(
        post=post, 
        user=request.user
    )
    
    if created:
        # 点赞成功，增加点赞数
        Post.objects.filter(pk=post.pk).update(likes_count=F('likes_count') + 1)
        return Response({'message': '点赞成功'}, status=status.HTTP_201_CREATED)
    else:
        # 取消点赞
        like.delete()
        Post.objects.filter(pk=post.pk).update(likes_count=F('likes_count') - 1)
        return Response({'message': '取消点赞'}, status=status.HTTP_200_OK)


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post', 'parent']
    ordering = ['created_at']
    
    def get_queryset(self):
        return Comment.objects.filter(is_approved=True)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateSerializer
        return CommentSerializer


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        if obj.author == request.user or request.user.is_staff:
            return super().update(request, *args, **kwargs)
        else:
            return Response(
                {'error': '您没有权限编辑此评论'}, 
                status=status.HTTP_403_FORBIDDEN
            )
    
    def delete(self, request, *args, **kwargs):
        obj = self.get_object()
        if obj.author == request.user or request.user.is_staff:
            return super().delete(request, *args, **kwargs)
        else:
            return Response(
                {'error': '您没有权限删除此评论'}, 
                status=status.HTTP_403_FORBIDDEN
            )


@api_view(['GET'])
def featured_posts(request):
    posts = Post.objects.filter(status='published', is_featured=True)[:5]
    serializer = PostListSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def popular_posts(request):
    posts = Post.objects.filter(status='published').order_by('-views_count')[:10]
    serializer = PostListSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def recent_posts(request):
    posts = Post.objects.filter(status='published').order_by('-published_at')[:10]
    serializer = PostListSerializer(posts, many=True)
    return Response(serializer.data)