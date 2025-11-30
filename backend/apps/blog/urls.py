from django.urls import path
from . import views

urlpatterns = [
    # 分类相关
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    
    # 标签相关
    path('tags/', views.TagListCreateView.as_view(), name='tag-list-create'),
    path('tags/<int:pk>/', views.TagDetailView.as_view(), name='tag-detail'),
    
    # 文章相关
    path('posts/', views.PostListView.as_view(), name='post-list'),
    path('posts/create/', views.PostCreateView.as_view(), name='post-create'),
    path('posts/featured/', views.featured_posts, name='featured-posts'),
    path('posts/popular/', views.popular_posts, name='popular-posts'),
    path('posts/recent/', views.recent_posts, name='recent-posts'),
    path('posts/my/', views.MyPostListView.as_view(), name='my-posts'),
    path('posts/<slug:slug>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<slug:slug>/edit/', views.PostUpdateView.as_view(), name='post-update'),
    path('posts/<slug:slug>/delete/', views.PostDeleteView.as_view(), name='post-delete'),
    
    # 点赞相关
    path('posts/<slug:slug>/like/', views.like_post, name='like-post'),
    
    # 评论相关
    path('comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
]