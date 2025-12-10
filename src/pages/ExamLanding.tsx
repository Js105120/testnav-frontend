import React, { useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const examTypeMap: Record<string, { name: string; subjects: { slug: string; label: string }[] }> = {
  suneung: {
    name: '수능',
    subjects: [
      { slug: 'korean', label: '국어' },
      { slug: 'math', label: '수학' },
      { slug: 'english', label: '영어' },
      { slug: 'social', label: '탐구-사회' },
      { slug: 'science', label: '탐구-과학' },
    ],
  },
  naesin: {
    name: '내신',
    subjects: [
      { slug: 'korean', label: '국어' },
      { slug: 'math', label: '수학' },
      { slug: 'english', label: '영어' },
      { slug: 'society', label: '사회' },
      { slug: 'science', label: '과학' },
    ],
  },
  gongmuwon: {
    name: '공무원',
    subjects: [
      { slug: 'korean', label: '국어(공무원)' },
      { slug: 'math', label: '수학(공무원)' },
      { slug: 'english', label: '영어(공무원)' },
      { slug: 'history', label: '한국사' },
      { slug: 'adminlaw', label: '행정법' },
      { slug: 'admin', label: '행정학' },
    ],
  },
  language: {
    name: '어학',
    subjects: [
      { slug: 'toeic', label: '토익' },
      { slug: 'toefl', label: '토플' },
      { slug: 'teps', label: '텝스' },
    ],
  },
};

const ExamLanding: React.FC = () => {
  const { examType } = useParams<{ examType: string }>();
  const config = useMemo(() => (examType ? examTypeMap[examType] : undefined), [examType]);

  if (!config) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-3">
            {config.name}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.name} 과목 선택</h1>
          <p className="text-gray-600">과목을 선택하면 해당 강사 목록 페이지로 이동합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.subjects.map((subject) => (
            <Link
              key={subject.slug}
              to={`/exam/${examType}/${subject.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div>
                <div className="text-sm text-gray-500 mb-1">{config.name}</div>
                <div className="text-lg font-semibold text-gray-900">{subject.label}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamLanding;
