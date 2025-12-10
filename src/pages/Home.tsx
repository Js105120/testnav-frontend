import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, BookOpen, MessageSquare, Sparkles, ArrowRight, Star, Award, Loader2 } from 'lucide-react';
import InstructorCard from '../components/InstructorCard';
import { getTopInstructors } from '../lib/instructorService';
import { getLatestPosts } from '../lib/communityService';
import { Instructor } from '../types';

const Home: React.FC = () => {
  const [topInstructors, setTopInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [postLoading, setPostLoading] = useState(true);

  useEffect(() => {
    loadTopInstructors();
    loadLatestPosts();
  }, []);

  const loadTopInstructors = async () => {
    setLoading(true);
    try {
      const instructors = await getTopInstructors(3);
      setTopInstructors(instructors);
    } catch (error) {
      console.error('Error loading top instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLatestPosts = async () => {
    setPostLoading(true);
    try {
      const data = await getLatestPosts();
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading latest posts:', error);
      setPosts([]);
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-blue-500/10"></div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
              <span className="text-gray-100">공부의 방향을 잡는 첫걸음,</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                Test Nav
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              수많은 인강 중에서 나에게 맞는 강사를 찾는 가장 쉬운 방법
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/find-instructor"
                className="group relative inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <BookOpen className="mr-2 h-5 w-5 relative z-10" />
                <span className="relative z-10">강사 매칭 시작하기</span>
                <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Top Instructors Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 backdrop-blur-sm mb-4">
              <Award className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">실시간 랭킹</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
              이달의 인기 강사 TOP 3
            </h2>
            <p className="text-gray-400 text-lg">수강생들이 직접 선정한 최고의 강사들</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
            </div>
          ) : topInstructors.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              등록된 강사가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-12">
              {[topInstructors[1], topInstructors[0], topInstructors[2]].filter(Boolean).map((instructor, displayIndex) => {
              const actualRank = displayIndex === 1 ? 1 : displayIndex === 0 ? 2 : 3;
              const isFirst = actualRank === 1;
              const rating = instructor.effective_rating ?? instructor.average_rating;

              const renderStars = (value: number) => (
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`${isFirst ? 'text-xl' : 'text-lg'}`}>
                      {star <= Math.floor(value) ? '⭐' :
                       star === Math.ceil(value) && value % 1 !== 0 ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
              );

              return (
                <Link
                  key={instructor.id}
                  to={`/instructor/${instructor.id}`}
                  className={`group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 shadow-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 overflow-hidden ${
                    isFirst ? 'md:scale-110 md:-mt-8' : ''
                  }`}
                >
                  <div className={`absolute top-4 left-4 z-10 ${
                    isFirst ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    actualRank === 2 ? 'bg-gradient-to-r from-slate-400 to-slate-500' :
                    'bg-gradient-to-r from-orange-400 to-orange-600'
                  } text-white font-bold px-4 py-2 rounded-full shadow-lg text-lg backdrop-blur-sm`}>
                    #{actualRank}
                  </div>

                  <div className="relative">
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={instructor.profile_image}
                        alt={instructor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                    </div>
                    {isFirst && (
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-transparent to-transparent pointer-events-none"></div>
                    )}
                  </div>

                  <div className={`p-6 ${isFirst ? 'bg-gradient-to-b from-orange-500/5 to-transparent' : ''}`}>
                    <h3 className={`font-bold mb-2 ${isFirst ? 'text-2xl' : 'text-xl'} text-white`}>
                      {instructor.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm font-medium rounded-full border border-cyan-500/30">
                        {instructor.exam_type}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-500/30">
                        {instructor.subject}
                      </span>
                    </div>

                    <div className="mb-3">
                      {renderStars(rating)}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`font-bold ${isFirst ? 'text-2xl' : 'text-xl'} text-white`}>
                          {rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-400">
                          ({instructor.total_ratings}명)
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {instructor.description}
                    </p>

                    {isFirst && (
                      <div className="flex items-center justify-center pt-4 border-t border-slate-700/50">
                        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent font-bold text-lg flex items-center gap-2">
                          <span className="text-2xl">👑</span>
                          <span>이달의 1위</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 backdrop-blur-sm mb-4">
              <MessageSquare className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-medium text-teal-300">커뮤니티</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              수험생 커뮤니티
            </h2>
            <p className="text-xl text-gray-400">
              함께 공부하는 수험생들과 정보를 공유하고 소통해보세요
            </p>
          </div>

          {postLoading ? (
            <div className="flex justify-center items-center py-12 text-gray-400">로딩 중...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">게시글이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/community/${post.id}`}
                  className="group block p-6 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 hover:border-teal-500/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-teal-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 mb-3 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="text-gray-400">{post.author_name || '익명'}</span>
                    <div className="flex items-center space-x-2 text-teal-400">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comment_count ?? 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/community"
              className="group inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-[0_0_40px_rgba(20,184,166,0.4)] transition-all duration-300"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              <span>커뮤니티 참여하기</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
