import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../../lib/communityService';

interface PostItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_name?: string;
  comment_count?: number;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('게시글 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-sm text-cyan-600 font-semibold">커뮤니티</div>
          <h1 className="text-2xl font-bold text-gray-900">게시글 목록</h1>
        </div>
        <Link
          to="/community/write"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          글쓰기
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-10">로딩 중...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">게시글이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/community/${post.id}`}
              className="block border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition"
            >
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <span>{post.user_name || '익명'}</span>
                <span>{new Date(post.created_at).toLocaleString()}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{post.title}</h3>
              <p className="text-gray-600 line-clamp-2">{post.content}</p>
              <div className="text-sm text-gray-400 mt-2">댓글 {post.comment_count ?? 0}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
