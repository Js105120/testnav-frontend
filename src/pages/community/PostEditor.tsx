import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, getPostDetail, updatePost } from '../../lib/communityService';

const PostEditor: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    if (mode === 'edit' && id) {
      (async () => {
        setLoading(true);
        try {
          const data = await getPostDetail(id);
          if (data?.post) {
            setTitle(data.post.title);
            setContent(data.post.content);
          }
        } catch (error) {
          console.error('게시글 불러오기 실패:', error);
          alert('게시글을 불러올 수 없습니다.');
          navigate('/community');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, mode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'create') {
        const result = await createPost({ title, content });
        const newId = result?.post_id;
        if (newId) {
          alert('저장되었습니다.');
          navigate(`/community/${newId}`);
          return;
        }
      } else if (id) {
        await updatePost(id, { title, content });
        alert('저장되었습니다.');
        navigate(`/community/${id}`);
        return;
      }
      // fallback
      navigate('/community');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{mode === 'create' ? '새 게시글 작성' : '게시글 수정'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border rounded-lg px-4 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          required
        />
        <textarea
          className="w-full border rounded-lg px-4 py-2 h-56"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            저장
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-lg"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
