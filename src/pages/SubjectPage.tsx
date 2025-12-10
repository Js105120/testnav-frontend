import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { searchInstructors } from '../lib/instructorService';
import { Instructor } from '../types';
import InstructorCard from '../components/InstructorCard';

const examTypeMap: Record<string, string> = {
  suneung: '수능',
  naesin: '내신',
  gongmuwon: '공무원',
  language: '어학',
};

const baseSubjectMap: Record<string, string> = {
  korean: '국어',
  math: '수학',
  english: '영어',
  society: '사회',
  science: '과학',
  social: '탐구-사회',
  inquiry_social: '탐구-사회',
  inquiry_science: '탐구-과학',
  history: '한국사',
  adminlaw: '행정법',
  admin: '행정학',
  toeic: '토익',
  toefl: '토플',
  teps: '텝스',
};

const SubjectPage: React.FC = () => {
  const { examType, subjectSlug } = useParams<{ examType: string; subjectSlug: string }>();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<'rating' | 'reviews' | 'recent'>('rating');

  const examName = useMemo(() => (examType ? examTypeMap[examType] : undefined), [examType]);
  const subjectName = useMemo(() => {
    if (!subjectSlug) return undefined;
    // 시험 종류에 따라 slug를 다른 과목명으로 매핑 (예: 수능/과학탐구 vs 내신/과학)
    if (examName === '수능') {
      if (subjectSlug === 'social') return '탐구-사회';
      if (subjectSlug === 'science') return '탐구-과학';
    }
    // 공무원 과목 특수 매핑
    if (examName === '공무원') {
      if (subjectSlug === 'korean') return '국어(공무원)';
      if (subjectSlug === 'math') return '수학(공무원)';
      if (subjectSlug === 'english') return '영어(공무원)';
    }
    // 기본 매핑
    return baseSubjectMap[subjectSlug];
  }, [subjectSlug, examName]);

  useEffect(() => {
    const fetchData = async () => {
      if (!examName || !subjectName) return;

      setLoading(true);
      setError(null);
      try {
        const data = await searchInstructors({
          exam_type: examName,
          subject: subjectName,
          sort: sort === 'recent' ? undefined : sort, // recent는 기본 정렬 사용
        });
        setInstructors(data);
      } catch (err) {
        console.error('과목별 강사 조회 실패:', err);
        setError('강사 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examName, subjectName, sort]);

  if (!examName || !subjectName) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-3">
            {examName}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {examName} {subjectName} 강사
          </h1>
          <p className="text-gray-600">해당 과목을 담당하는 강사 목록을 확인하세요.</p>
        </div>

        <div className="flex justify-end mb-4">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="rating">평점순</option>
            <option value="reviews">리뷰순</option>
            <option value="recent">최신순</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">불러오는 중...</div>
        ) : error ? (
          <div className="flex justify-center items-center py-20 text-red-600">{error}</div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            등록된 강사가 없습니다. 조금만 기다려 주세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectPage;
