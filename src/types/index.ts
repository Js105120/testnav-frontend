export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'student' | 'teacher' | 'admin';
  user_type?: 'student' | 'teacher' | 'admin';
  created_at: string;
}

export interface Instructor {
  id: string;
  name: string;
  subject_id?: number;
  subject: string;
  exam_type: string;
  profile_image?: string;
  description: string;
  youtube_video_id?: string;
  effective_rating?: number;
  average_rating: number;
  total_ratings: number;
  created_at: string;
  tags?: string[];
  is_active?: boolean;
}

export interface Review {
  id: string;
  user_id: string;
  instructor_id: string;
  comment: string;
  rating: number;
  user_name: string;
  tags?: string[];
  created_at: string;
}

export interface ReviewTag {
  id: string;
  review_id: string;
  tag: string;
  created_at: string;
}

export const AVAILABLE_TAGS = [
  '개념 설명이 명확해요',
  '문제 풀이가 자세해요',
  '강의 속도가 적절해요',
  '커리큘럼이 체계적이에요',
  '질문 답변이 빨라요',
  '교재가 알차요'
] as const;

export type ReviewTagType = typeof AVAILABLE_TAGS[number];

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  user_name: string;
  comments_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  user_name: string;
  created_at: string;
}

export interface Rating {
  id: string;
  user_id: string;
  instructor_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export type ExamType = '수능' | '내신' | '어학' | '공무원';
export type Subject = '국어' | '수학' | '영어' | '탐구' | '제2외국어' | 'TOEIC' | 'TOEFL' | 'IELTS' | '국어(공무원)' | '수학(공무원)' | '영어(공무원)' | '한국사' | '행정학' | '경제학';

export interface LearningStyle {
  id: string;
  label: string;
  description: string;
}
