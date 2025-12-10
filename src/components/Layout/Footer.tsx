import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xl inline-block mb-4">
              Test Nav
            </div>
            <p className="text-gray-600 max-w-md">
              시험별 인강 네비게이터는 수험생들이 자신에게 맞는 최적의 온라인 강의 강사를 찾을 수 있도록 도와드립니다.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">시험 종류</h3>
            <ul className="space-y-2">
              <li><a href="/exam/suneung" className="text-gray-600 hover:text-blue-600 transition-colors">수능</a></li>
              <li><a href="/exam/naesin" className="text-gray-600 hover:text-blue-600 transition-colors">내신</a></li>
              <li><a href="/exam/language" className="text-gray-600 hover:text-blue-600 transition-colors">어학</a></li>
              <li><a href="/exam/gongmuwon" className="text-gray-600 hover:text-blue-600 transition-colors">공무원</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">서비스</h3>
            <ul className="space-y-2">
              <li><a href="/find-instructor" className="text-gray-600 hover:text-blue-600 transition-colors">강사 찾기</a></li>
              <li><a href="/community" className="text-gray-600 hover:text-blue-600 transition-colors">커뮤니티</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">서비스 소개</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500">&copy; 2024 Test Nav. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;