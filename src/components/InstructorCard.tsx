import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Instructor } from '../types';

interface InstructorCardProps {
  instructor: Instructor;
  rank?: number;
  showRank?: boolean;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, rank, showRank = false }) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Link to={`/instructor/${instructor.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-300 group-hover:-translate-y-1">
        {showRank && rank && (
          <div className="flex items-center justify-between mb-4">
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
              rank === 1 ? 'bg-yellow-100 text-yellow-800' :
              rank === 2 ? 'bg-gray-100 text-gray-800' :
              rank === 3 ? 'bg-orange-100 text-orange-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              #{rank}
            </div>
          </div>
        )}

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={instructor.profile_image || 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=200'}
              alt={instructor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {instructor.name}
              </h3>
              <div className="flex items-center space-x-1">
                {renderStars(instructor.average_rating)}
                <span className="text-sm font-semibold text-gray-700 ml-1">
                  {instructor.average_rating.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {instructor.exam_type}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                {instructor.subject}
              </span>
              <span className="text-xs text-gray-500">
                평가 {instructor.total_ratings}명
              </span>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2">
              {instructor.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InstructorCard;