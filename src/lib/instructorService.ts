import { Instructor, Review } from '../types';
import api from './api';

const normalizeInstructor = (item: any): Instructor => ({
  id: String(item.id),
  name: item.name,
  subject: item.subject || item.subject_name || '',
  subject_id: item.subject_id,
  exam_type: item.exam_type || '',
  profile_image: item.profile_image,
  description: item.description || '',
  youtube_video_id: item.youtube_video_id,
  effective_rating: Number(
    item.effective_rating ??
      item.average_rating ??
      item.avg_rating ??
      0
  ),
  average_rating: Number(item.average_rating || item.avg_rating || 0),
  total_ratings: Number(item.total_ratings || item.review_count || 0),
  created_at: item.created_at || new Date().toISOString(),
  tags: item.tags || [],
  // admin 화면에서는 is_active 여부를 보여준다
  // (백엔드가 값을 내려주지 않으면 undefined로 처리)
  ...(item.is_active !== undefined ? { is_active: !!item.is_active } : {}),
});

export const getInstructors = async (params?: Record<string, any>): Promise<Instructor[]> => {
  try {
    const { data } = await api.get('/instructors', { params });
    return data?.data?.map(normalizeInstructor) || [];
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return [];
  }
};

export const searchInstructors = async (params: {
  exam_type?: string;
  subject?: string;
  keyword?: string;
  tags?: string[];
  subject_id?: number;
  sort?: 'rating' | 'reviews' | 'recent';
}): Promise<Instructor[]> => {
  try {
    const { data } = await api.get('/instructors/search', {
      params: {
        ...params,
        tags: params.tags ? params.tags.join(',') : undefined,
      },
    });
    return data?.data?.map(normalizeInstructor) || [];
  } catch (error) {
    console.error('Error searching instructors:', error);
    return [];
  }
};

export const getInstructorById = async (
  id: string
): Promise<{ instructor: Instructor | null; reviews: Review[] }> => {
  try {
    const { data } = await api.get(`/instructors/${id}/detail`);
    return {
      instructor: data?.instructor ? normalizeInstructor(data.instructor) : null,
      reviews:
        data?.reviews?.map((review: any) => ({
          ...review,
          id: String(review.id),
          comment: review.comment || review.content || '',
          created_at: review.created_at,
        })) || [],
    };
  } catch (error) {
    console.error('Error fetching instructor detail:', error);
    return { instructor: null, reviews: [] };
  }
};

export const getTopInstructors = async (limit: number = 3): Promise<Instructor[]> => {
  try {
    const { data } = await api.get('/instructors/top3');
    return data?.data?.map(normalizeInstructor) || [];
  } catch (error) {
    console.error('Error fetching top instructors:', error);
    return [];
  }
};

export const getRecommendedInstructors = async (params: {
  exam_type?: string;
  subject?: string;
  subject_id?: number;
  tags?: string[];
}): Promise<Instructor[]> => {
  try {
    const { data } = await api.get('/instructors/recommend', {
      params: {
        ...params,
        tags: params.tags ? params.tags.join(',') : undefined,
      },
    });
    return data?.data?.map(normalizeInstructor) || [];
  } catch (error) {
    console.error('Error fetching recommended instructors:', error);
    return [];
  }
};
