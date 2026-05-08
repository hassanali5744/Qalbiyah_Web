import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSpinner, FaBookmark, FaRegBookmark, FaShareAlt } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';

export default function ContentDetailPage() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/content/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Content not found');
        }
        
        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const checkBookmark = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(`http://localhost:5000/api/bookmarks/check/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setIsBookmarked(data.isBookmarked);
          }
        }
      } catch (err) {
        console.error('Error checking bookmark:', err);
      }
    };

    fetchContent();
    checkBookmark();
  }, [id]);

  const toggleBookmark = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to bookmark content');
        return;
      }

      const method = isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-purple-600 text-4xl" />
      </div>
    );
  }

  if (error) {  // Changed from if (!error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Content</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/stories-lessons" className="text-purple-600 hover:text-purple-800 font-medium">
            Back to Stories & Lessons
          </Link>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Content Not Found</h2>
          <Link to="/stories-lessons" className="text-purple-600 hover:text-purple-800 font-medium">
            Back to Stories & Lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link 
            to="/stories-lessons" 
            className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
          >
            <FiArrowLeft className="mr-2" /> Back to Stories & Lessons
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              content.type === 'story' ? 'bg-blue-100 text-blue-800' :
              content.type === 'lesson' ? 'bg-green-100 text-green-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
            </span>
            <div className="flex gap-3">
              <button 
                onClick={toggleBookmark}
                className="text-gray-500 hover:text-purple-600 transition-colors"
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? 
                  <FaBookmark className="text-purple-600" /> : 
                  <FaRegBookmark />}
              </button>
              <button className="text-gray-500 hover:text-purple-600 transition-colors" title="Share">
                <FaShareAlt />
              </button>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-purple-800 mb-4">{content.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {content.tags && content.tags.split(',').map(tag => (
              <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                #{tag.trim()}
              </span>
            ))}
          </div>

          <div className="prose max-w-none text-gray-700">
            {content.content_text && content.content_text.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-purple-100">
            <Link 
              to="/stories-lessons" 
              className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
            >
              <FiArrowLeft className="mr-2" /> Back to all {content.type === 'hadith' ? 'Hadith' : content.type + 's'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}