import api from './api';

export interface PostPayload {
  title: string;
  content: string;
}

export const getPosts = async () => {
  const { data } = await api.get('/community/posts');
  return data?.data || [];
};

export const getLatestPosts = async () => {
  const { data } = await api.get('/community/posts/latest');
  return data?.data || [];
};

export const getPostDetail = async (id: string | number) => {
  const { data } = await api.get(`/community/posts/${id}`);
  // 백엔드가 {success, data:{post, comments}} 형태를 반환하므로 안전 파싱
  const payload = data?.data ?? data;
  return {
    post: payload?.post ?? payload?.data?.post ?? null,
    comments: payload?.comments ?? payload?.data?.comments ?? [],
  };
};

export const createPost = async (payload: PostPayload) => {
  const { data } = await api.post('/community/posts', payload);
  return data;
};

export const updatePost = async (id: string | number, payload: PostPayload) => {
  return api.put(`/community/posts/${id}`, payload);
};

export const deletePost = async (id: string | number) => {
  return api.delete(`/community/posts/${id}`);
};

export const createComment = async (payload: { post_id: string | number; content: string }) => {
  return api.post('/community/comments', payload);
};

export const updateComment = async (id: string | number, payload: { content: string }) => {
  return api.put(`/community/comments/${id}`, payload);
};

export const deleteComment = async (id: string | number) => {
  return api.delete(`/community/comments/${id}`);
};
