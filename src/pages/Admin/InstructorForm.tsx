import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../../lib/api';
import { getInstructorById } from '../../lib/instructorService';

interface Subject {
  id: number;
  name: string;
  exam_type: string;
}

const InstructorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    profile_image: '',
    youtube_video_id: '',
    is_active: true,
  });

  useEffect(() => {
    loadSubjects();
    if (isEdit && id) {
      loadInstructor(id);
    }
  }, [id]);

  const loadSubjects = async () => {
    try {
      const { data } = await api.get('/instructors/subjects');
      if (data?.data) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error('과목 목록 조회 실패:', error);
    }
  };

  const loadInstructor = async (instructorId: string) => {
    setLoading(true);
    try {
      const { instructor } = await getInstructorById(instructorId);
      if (instructor) {
        setFormData({
          name: instructor.name || '',
          description: instructor.description || '',
          profile_image: instructor.profile_image || '',
          youtube_video_id: instructor.youtube_video_id || '',
          is_active: (instructor as any).is_active ?? true,
        });
        if (instructor.subject_id) {
          setSelectedSubjectId(String(instructor.subject_id));
        }
      }
    } catch (error) {
      console.error('강사 정보 조회 실패:', error);
      alert('강사 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (!selectedSubjectId) {
      alert('과목을 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        subject_id: Number(selectedSubjectId),
        profile_image: formData.profile_image,
        description: formData.description,
        tags: [],
        youtube_link: formData.youtube_video_id,
        is_active: formData.is_active,
      };

      if (isEdit && id) {
        await api.put(`/admin/instructors/${id}`, payload);
        alert('강사 정보가 수정되었습니다.');
      } else {
        await api.post('/admin/instructors', payload);
        alert('강사가 등록되었습니다.');
      }

      navigate('/admin');
    } catch (error) {
      console.error('강사 저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? '강사 정보 수정' : '강사 등록'}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">과목 선택 *</label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => setSelectedSubjectId(String(subject.id))}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedSubjectId === String(subject.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {subject.name} ({subject.exam_type})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">상세 설명</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">프로필 이미지 URL</label>
                <input
                  type="url"
                  value={formData.profile_image}
                  onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube 비디오 ID</label>
                <input
                  type="text"
                  value={formData.youtube_video_id}
                  onChange={(e) => setFormData({ ...formData, youtube_video_id: e.target.value })}
                  placeholder="예: dQw4w9WgXcQ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                활성화
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? '수정' : '등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstructorForm;
