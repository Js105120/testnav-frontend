import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, ChevronDown, X, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Instructor } from '../../types';
import { searchInstructors } from '../../lib/instructorService';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [showSubNav, setShowSubNav] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Instructor[]>([]);

  const handleNavHover = (examName: string) => {
    if (['수능', '내신', '공무원', '어학'].includes(examName)) {
      setShowSubNav(examName);
    }
  };

  const handleNavLeave = () => {
    setShowSubNav(null);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchInstructors({ keyword: query });
      setSearchResults(results);
    } catch (error) {
      console.error('검색 실패:', error);
      setSearchResults([]);
    }
  };

  const handleInstructorClick = (id: string) => {
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/instructor/${id}`);
  };

  const closeSearchModal = () => {
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const subjectsByExam = {
    '수능': [
      { name: '국어', path: '/exam/suneung/korean' },
      { name: '수학', path: '/exam/suneung/math' },
      { name: '영어', path: '/exam/suneung/english' },
      { name: '사회탐구', path: '/exam/suneung/social' },
      { name: '과학탐구', path: '/exam/suneung/science' }
    ],
    '내신': [
      { name: '국어', path: '/exam/naesin/korean' },
      { name: '수학', path: '/exam/naesin/math' },
      { name: '영어', path: '/exam/naesin/english' },
      { name: '사회탐구', path: '/exam/naesin/social' },
      { name: '과학탐구', path: '/exam/naesin/science' }
    ],
    '공무원': [
      { name: '국어', path: '/exam/gongmuwon/korean' },
      { name: '수학', path: '/exam/gongmuwon/math' },
      { name: '영어', path: '/exam/gongmuwon/english' },
      { name: '한국사', path: '/exam/gongmuwon/history' },
      { name: '행정법', path: '/exam/gongmuwon/adminlaw' },
      { name: '행정학', path: '/exam/gongmuwon/admin' }
    ],
    '어학': [
      { name: '토익', path: '/exam/language/toeic' },
      { name: '토플', path: '/exam/language/toefl' },
      { name: '텝스', path: '/exam/language/teps' }
    ]
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xl">
              Test Nav
            </div>
          </Link>

          <nav className="flex items-center space-x-1">
            <div
              className="relative"
              onMouseEnter={() => handleNavHover('수능')}
              onMouseLeave={handleNavLeave}
            >
              <Link
                to="/exam/suneung/korean"
                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/exam/suneung')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                수능
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>

              {showSubNav === '수능' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {subjectsByExam['수능'].map((subject) => (
                    <Link
                      key={subject.name}
                      to={subject.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {subject.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleNavHover('내신')}
              onMouseLeave={handleNavLeave}
            >
              <Link
                to="/exam/naesin/korean"
                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/exam/naesin')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                내신
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>

              {showSubNav === '내신' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {subjectsByExam['내신'].map((subject) => (
                    <Link
                      key={subject.name}
                      to={subject.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {subject.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleNavHover('어학')}
              onMouseLeave={handleNavLeave}
            >
              <Link
                to="/exam/language/toeic"
                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/exam/language')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                어학
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>

              {showSubNav === '어학' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {subjectsByExam['어학'].map((subject) => (
                    <Link
                      key={subject.name}
                      to={subject.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {subject.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleNavHover('공무원')}
              onMouseLeave={handleNavLeave}
            >
              <Link
                to="/exam/gongmuwon/korean"
                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/exam/gongmuwon')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                공무원
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>

              {showSubNav === '공무원' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {subjectsByExam['공무원'].map((subject) => (
                    <Link
                      key={subject.name}
                      to={subject.path}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {subject.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/find-instructor"
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === '/find-instructor'
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              나의 맞는 강사 찾기
            </Link>

            <Link
              to="/community"
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith('/community')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              커뮤니티
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <Settings className="mr-1 h-4 w-4" />
                관리자
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">강사 검색</h2>
              <button
                onClick={closeSearchModal}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="강사 이름, 과목, 시험 유형, 태그로 검색..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="p-8 text-center text-gray-500">
                  강사 이름, 과목, 시험 유형 또는 태그를 입력하여 검색하세요
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  검색 결과가 없습니다
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {searchResults.map((instructor) => (
                    <button
                      key={instructor.id}
                      onClick={() => handleInstructorClick(instructor.id)}
                      className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center space-x-4"
                    >
                      <img
                        src={instructor.profile_image}
                        alt={instructor.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {instructor.exam_type} · {instructor.subject}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {instructor.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          추천 {instructor.recommendations}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
