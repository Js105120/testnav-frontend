import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Play, MessageSquare, User, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AVAILABLE_TAGS, Instructor, Review } from '../types';
import { getInstructorById } from '../lib/instructorService';
import api from '../lib/api';

const InstructorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'reviews' | 'curriculum'>('reviews');
  const [reviewContent, setReviewContent] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDetail(id);
    }
  }, [id]);

  const loadDetail = async (instructorId: string) => {
    setLoading(true);
    try {
      const { instructor, reviews } = await getInstructorById(instructorId);
      setInstructor(instructor);
      setReviews(reviews);
    } catch (error) {
      console.error('강사 상세 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmitReview = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!reviewContent.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    if (reviewRating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }

    try {
      await api.post(`/instructors/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewContent,
        tags: selectedTags,
      });
      await loadDetail(id!);
      setShowReviewForm(false);
      setReviewContent('');
      setReviewRating(0);
      setSelectedTags([]);
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 작성 중 오류가 발생했습니다.');
    }
  };

  const renderStars = (rating: number, size: string = 'h-5 w-5') => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`${size} ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">강사를 찾을 수 없습니다</h2>
          <p className="text-gray-600">요청하신 강사 정보가 존재하지 않습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <img
                src={
                  instructor.profile_image ||
                  'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=200'
                }
                alt={instructor.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{instructor.name}</h1>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {instructor.exam_type}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                  {instructor.subject}
                </span>
                <div className="flex items-center space-x-2">
                  {renderStars(Math.round(instructor.average_rating))}
                  <span className="text-lg font-semibold text-gray-900">{instructor.average_rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({instructor.total_ratings}명)</span>
                </div>
              </div>

              <p className="text-gray-700 mb-4 text-lg leading-relaxed">{instructor.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="inline h-4 w-4 mr-2" />
                리뷰 ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'curriculum'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Play className="inline h-4 w-4 mr-2" />
                커리큘럼 미리보기
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'reviews' ? (
              <div>
                <div className="mb-6">
                  <button
                    onClick={() => {
                      if (!user) {
                        alert('로그인이 필요합니다.');
                        navigate('/login');
                        return;
                      }
                      setShowReviewForm(!showReviewForm);
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {showReviewForm ? '리뷰 작성 취소' : '리뷰 작성하기'}
                  </button>
                </div>

                {showReviewForm && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-lg border-2 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">리뷰 작성</h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">별점 선택</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setReviewRating(star)} className="transition-transform hover:scale-110">
                            <Star
                              className={`h-8 w-8 ${
                                star <= reviewRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        {reviewRating > 0 && (
                          <span className="text-sm text-gray-600">선택한 별점: {reviewRating}점</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 내용</label>
                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="강의 스타일, 장점, 아쉬운 점 등을 솔직하게 작성해주세요."
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">느낀 점 태그 선택 (복수 선택 가능)</label>
                      <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleToggleTag(tag)}
                            className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                              selectedTags.includes(tag)
                                ? 'bg-blue-100 text-blue-700 border-blue-300'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-200'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                        취소
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        등록하기
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">아직 등록된 리뷰가 없습니다.</div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{review.user_name}</div>
                              <div className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {renderStars(review.rating, 'h-4 w-4')}
                            <span className="text-sm font-medium text-gray-700">{review.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                        {review.tags && review.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {review.tags.map((tag) => (
                              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                  <Play className="h-8 w-8 mr-2" />
                  <span>커리큘럼 영상은 준비 중입니다.</span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">커리큘럼 미리보기</h3>
                  <p className="text-gray-700 leading-relaxed">
                    곧 상세 커리큘럼, 샘플 강의 등이 업로드될 예정입니다. 강사님께 직접 문의하거나 리뷰를 참고해주세요.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetail;
