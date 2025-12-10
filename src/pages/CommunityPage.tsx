import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white border border-gray-200 shadow-sm rounded-2xl p-10 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
          수험생 커뮤니티
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">커뮤니티 참가하기</h1>
        <p className="text-gray-600 mb-8">
          수험생들을 위한 커뮤니티 공간입니다. 로그인된 사용자만 참여할 수 있습니다.
        </p>
        <button
          type="button"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
          onClick={() => alert('커뮤니티 참여 신청이 완료되었습니다.')}
        >
          커뮤니티 참가하기
        </button>
      </div>
    </div>
  );
};

export default CommunityPage;
