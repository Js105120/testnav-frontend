import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronRight, BookOpen, Target, Check } from 'lucide-react';
import { ExamType, Subject, LearningStyle, AVAILABLE_TAGS, Instructor } from '../types';
import InstructorCard from '../components/InstructorCard';
import { getRecommendedInstructors } from '../lib/instructorService';

const FindInstructor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedExamType, setSelectedExamType] = useState<ExamType | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const examType = searchParams.get('examType') as ExamType;
    const subject = searchParams.get('subject') as Subject;
    const tags = searchParams.get('tags');

    if (examType && subject) {
      setSelectedExamType(examType);
      setSelectedSubject(subject);
      if (tags) setSelectedStyles(tags.split(','));
      fetchRecommendations(examType, subject, tags?.split(',').filter(Boolean) || []);
      setStep(4);
    }
  }, [searchParams]);

  const examTypes: ExamType[] = ['수능', '내신', '어학', '공무원'];

  const subjectsByExamType: Record<ExamType, Subject[]> = {
    수능: ['국어', '수학', '영어', '탐구', '제2외국어'],
    내신: ['국어', '수학', '영어'],
    어학: ['TOEIC', 'TOEFL', 'IELTS'],
    공무원: ['국어(공무원)', '수학(공무원)', '영어(공무원)', '한국사', '행정학', '경제학'],
  };

  const learningStyles: LearningStyle[] = AVAILABLE_TAGS.map((tag, index) => ({
    id: String(index + 1),
    label: tag,
    description: '',
  }));

  const handleStyleToggle = (styleLabel: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleLabel) ? prev.filter((s) => s !== styleLabel) : [...prev, styleLabel]
    );
  };

  const fetchRecommendations = async (
    examType?: string | null,
    subject?: string | null,
    tags: string[] = []
  ) => {
    setLoading(true);
    try {
      const data = await getRecommendedInstructors({
        exam_type: examType || undefined,
        subject: subject || undefined,
        tags: tags.length ? tags : undefined,
      });
      setRecommendations(data);
    } catch (error) {
      console.error('추천 로드 실패:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFindInstructors = () => {
    fetchRecommendations(selectedExamType, selectedSubject, selectedStyles);
    setStep(4);
  };

  const resetSearch = () => {
    setStep(1);
    setSelectedExamType(null);
    setSelectedSubject(null);
    setSelectedStyles([]);
    setRecommendations([]);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">준비하시는 시험을 선택해주세요</h2>
              <p className="text-gray-600">어떤 시험을 준비하고 계신가요?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {examTypes.map((examType) => (
                <button
                  key={examType}
                  onClick={() => {
                    setSelectedExamType(examType);
                    setStep(2);
                  }}
                  className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {examType}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-10 w-10 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">과목을 선택해주세요</h2>
              <p className="text-gray-600">{selectedExamType} 중에서 어떤 과목을 공부하실 건가요?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {selectedExamType &&
                subjectsByExamType[selectedExamType].map((subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setStep(3);
                    }}
                    className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all duration-300 group"
                  >
                    <div className="text-base font-semibold text-gray-900 group-hover:text-teal-600">
                      {subject}
                    </div>
                  </button>
                ))}
            </div>

            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700 transition-colors">
              ← 이전 단계
            </button>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">학습 성향을 선택해주세요</h2>
              <p className="text-gray-600">본인의 학습 스타일과 맞는 항목을 모두 선택해주세요 (복수 선택 가능)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {learningStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleToggle(style.label)}
                  className={`p-4 text-left bg-white rounded-xl border-2 transition-all duration-300 ${
                    selectedStyles.includes(style.label)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        selectedStyles.includes(style.label) ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}
                    >
                      {selectedStyles.includes(style.label) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">{style.label}</div>
                      <div className="text-sm text-gray-600">{style.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => setStep(2)} className="text-gray-500 hover:text-gray-700 transition-colors">
                ← 이전 단계
              </button>
              <button
                onClick={handleFindInstructors}
                disabled={selectedStyles.length === 0}
                className={`inline-flex items-center px-6 py-3 rounded-lg text-white ${
                  selectedStyles.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                } transition-colors`}
              >
                추천 강사 보기
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">추천 강사를 불러오는 중입니다...</div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">추천 가능한 강사가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((instructor, index) => (
                  <InstructorCard key={instructor.id} instructor={instructor} rank={index + 1} showRank />
                ))}
              </div>
            )}

            <button
              onClick={resetSearch}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              다시 선택하기
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            나에게 맞는 강사 찾기
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">3단계로 끝내는 강사 매칭</h1>
          <p className="text-gray-600">시험 유형, 과목, 학습 성향만 알려주세요. 딱 맞는 강사를 추천해드릴게요.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-10">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-3 ${
                    step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {stepNumber === 1 && '시험 선택'}
                  {stepNumber === 2 && '과목 선택'}
                  {stepNumber === 3 && '학습 성향'}
                </div>
              </div>
            ))}
          </div>

          <div>{renderStep()}</div>
        </div>
      </div>
    </div>
  );
};

export default FindInstructor;
