import { Instructor, Review, Post } from '../types';

export const mockInstructors: Instructor[] = [
  {
    id: '39db3e76-7f85-47a3-bffa-90dbfe75f727',
    name: '현우진',
    subject: '수학',
    exam_type: '수능',
    profile_image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: '15년 경력의 수학 전문 강사입니다. 개념부터 심화까지 체계적으로 가르칩니다.',
    youtube_video_id: 'dQw4w9WgXcQ',
    average_rating: 4.5,
    total_ratings: 150,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7b925147-0dc0-4442-a4a3-3cb95bcf240d',
    name: '조정식',
    subject: '영어',
    exam_type: '수능',
    profile_image: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: '원어민급 발음과 체계적인 문법 설명으로 영어 실력을 향상시켜드립니다.',
    youtube_video_id: 'dQw4w9WgXcQ',
    average_rating: 4.3,
    total_ratings: 120,
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '6a408e85-b1c7-4ab8-82bb-9f42b8c04620',
    name: '강민철',
    subject: '국어',
    exam_type: '수능',
    profile_image: 'https://images.pexels.com/photos/5212702/pexels-photo-5212702.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: '현대문학부터 고전문학까지, 수능 국어의 모든 영역을 완벽하게 정리해드립니다.',
    youtube_video_id: 'dQw4w9WgXcQ',
    average_rating: 4.2,
    total_ratings: 100,
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4b7d3308-531a-43c6-9569-4fe58fa3e630',
    name: '박혜원',
    subject: 'TOEIC',
    exam_type: '어학',
    profile_image: 'https://images.pexels.com/photos/5212361/pexels-photo-5212361.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'TOEIC 990점 만점자가 알려주는 실전 토익 공략법입니다.',
    youtube_video_id: 'dQw4w9WgXcQ',
    average_rating: 4.4,
    total_ratings: 90,
    created_at: '2024-01-04T00:00:00Z'
  },
  {
    id: 'd217c82a-e9b1-4882-9540-614e0fa75271',
    name: '이선재',
    subject: '지방직9급,국어',
    exam_type: '공무원',
    profile_image: 'https://images.pexels.com/photos/5212664/pexels-photo-5212664.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: '공무원 시험 행정학 1타 강사입니다. 이론과 문제풀이를 균형있게 진행합니다.',
    youtube_video_id: 'dQw4w9WgXcQ',
    average_rating: 4.1,
    total_ratings: 80,
    created_at: '2024-01-05T00:00:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    user_id: '1',
    instructor_id: '39db3e76-7f85-47a3-bffa-90dbfe75f727',
    content: '수학을 이렇게 쉽게 설명해주시는 선생님은 처음이에요. 개념이 확실히 잡혔습니다!',
    rating: 5,
    user_name: '수험생A',
    tags: ['개념 설명이 명확해요', '커리큘럼이 체계적이에요'],
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    user_id: '2',
    instructor_id: '39db3e76-7f85-47a3-bffa-90dbfe75f727',
    content: '체계적인 진행과 풍부한 문제로 실력이 많이 늘었어요.',
    rating: 4,
    user_name: '수험생B',
    tags: ['문제 풀이가 자세해요', '교재가 알차요'],
    created_at: '2024-01-08T14:30:00Z'
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    user_id: '1',
    title: '수능 수학 공부법 공유합니다',
    content: '개념서부터 기출문제까지 체계적으로 공부하는 방법을 공유해드려요.',
    user_name: '수험생A',
    comments_count: 12,
    created_at: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    user_id: '2',
    title: '영어 단어 암기 꿀팁',
    content: '하루에 100개씩 외우는 저만의 방법을 알려드릴게요!',
    user_name: '수험생B',
    comments_count: 8,
    created_at: '2024-01-14T16:20:00Z'
  }
];