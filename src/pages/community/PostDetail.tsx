import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deletePost,
  getPostDetail,
  createComment,
  updateComment,
  deleteComment,
} from '../../lib/communityService';
import { useAuth } from '../../contexts/AuthContext';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user_id: number;
  user_name?: string;
}

interface CommentItem {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  user_name?: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const load = async () => {
    if (!id) {
      alert('잘못된 경로입니다.');
      navigate('/community');
      return;
    }
    setLoading(true);
    try {
      const data = await getPostDetail(id);
      setPost(data?.post || null);
      setComments(data?.comments || []);
    } catch (error) {
      console.error('게시글 조회 실패:', error);
      alert('게시글을 불러올 수 없습니다.');
      navigate('/community');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const isPostOwner = user && post && (user.id === String(post.user_id) || user.user_type === 'admin');

  const handleDeletePost = async () => {
    if (!id) return;
    if (!confirm('게시글을 삭제하시겠습니까?')) return;
    await deletePost(id);
    alert('삭제되었습니다.');
    navigate('/community');
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;
    await createComment({ post_id: id!, content: newComment });
    setNewComment('');
    load();
  };

  const handleUpdateComment = async () => {
    if (!editingId || !editingContent.trim()) return;
    await updateComment(editingId, { content: editingContent });
    setEditingId(null);
    setEditingContent('');
    load();
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    await deleteComment(commentId);
    load();
  };

  if (loading) return <div className="text-center py-10 text-gray-500">로딩 중...</div>;
  if (!post) return <div className="text-center py-10 text-gray-500">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
          <div className="text-sm text-gray-500">
            {post.user_name || '익명'} · {new Date(post.created_at).toLocaleString()}
          </div>
        </div>
        {isPostOwner && (
          <div className="flex gap-2">
            <Link
              to={`/community/${post.id}/edit`}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              수정
            </Link>
            <button
              onClick={handleDeletePost}
              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg p-4 text-gray-800 whitespace-pre-wrap mb-8">
        {post.content}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">댓글</h2>
        <div className="space-y-3 mb-4">
          {comments.length === 0 && <div className="text-gray-500">댓글이 없습니다.</div>}
          {comments.map((c) => {
            const isOwner = user && (user.id === String(c.user_id) || user.user_type === 'admin');
            return (
              <div key={c.id} className="border rounded-lg p-3">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>{c.user_name || '익명'}</span>
                  <span>{new Date(c.created_at).toLocaleString()}</span>
                </div>
                {editingId === c.id ? (
                  <>
                    <textarea
                      className="w-full border rounded-lg px-3 py-2 mb-2"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateComment}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 border rounded-lg text-sm"
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-gray-800 whitespace-pre-wrap">{c.content}</div>
                    {isOwner && (
                      <div className="flex gap-2 mt-2 text-sm">
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setEditingContent(c.content);
                          }}
                          className="px-2 py-1 border rounded-lg"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded-lg"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="border rounded-lg p-3">
          <textarea
            className="w-full border rounded-lg px-3 py-2 mb-2"
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleCreateComment}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            댓글 작성
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
