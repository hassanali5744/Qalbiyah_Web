import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebook, FaInstagram, FaTwitter, FaDiscord, FaLinkedinIn, FaGithub,
  FaBookmark, FaRegBookmark, FaSpinner
} from "react-icons/fa";
import { FiBookOpen, FiShare2 } from "react-icons/fi";

export default function StoriesAndLessons() {
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/stories?type=${filter}`);
        if (!response.ok) throw new Error('Failed to fetch content');
        const data = await response.json();
        setContentItems(data.content);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:5000/api/bookmarks', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setBookmarkedIds(data.bookmarks.map(b => b.content_id));
          }
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
      }
    };

    fetchContent();
    fetchBookmarks();
  }, [filter]);

  const toggleBookmark = async (contentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to bookmark content');
        return;
      }

      const isBookmarked = bookmarkedIds.includes(contentId);
      const method = isBookmarked ? 'DELETE' : 'POST';
      
      const response = await fetch(`http://localhost:5000/api/bookmarks/${contentId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setBookmarkedIds(prev => 
          isBookmarked 
            ? prev.filter(id => id !== contentId)
            : [...prev, contentId]
        );
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen flex flex-col font-sans">
      {/* Header (unchanged) */}
      <header className="p-6">
        <div className="text-center">
          <Link to="/">
            <h1 className="text-5xl font-extrabold text-purple-600 font-[cursive] tracking-wide drop-shadow-md hover:text-purple-700 transition-colors">
              Qalbiyah
            </h1>
          </Link>
          <p className="text-purple-400 mt-2 text-sm">Your Spiritual Companion</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 mt-6 text-sm sm:text-base font-medium">
          {[
            { name: "Read Quran", link: "/read-quran-page" },
            { name: "Quran Quiz", link: "/quiz" },
            { name: "I am Feeling", link: "/feeling" },
            { name: "Stories & Lessons", link: "/stories-lessons", active: true },
            { name: "Qibla and Timing", link: "/qibla-namaz" },
            { name: "Donate", link: "/donate" },
          ].map(({ name, link, active }) => (
            <Link
              key={name}
              to={link}
              className={`${
                active 
                  ? "text-purple-700 font-bold border-b-2 border-purple-600" 
                  : "text-gray-600 hover:text-purple-500"
              } transition-colors duration-300 pb-1`}
            >
              {name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-purple-700 mb-3">Stories & Lessons</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore Islamic wisdom through inspiring stories, valuable lessons, and authentic Hadith.
          </p>
          
          {/* Content Type Filter */}
          <div className="flex justify-center gap-4 mt-6">
            {['all', 'story', 'lesson', 'hadith'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 hover:bg-purple-50 border border-purple-200'
                }`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin text-purple-500 text-4xl mx-auto mb-4" />
            <p>Loading content...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        ) : contentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contentItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-purple-50 hover:border-purple-100 flex flex-col h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.type === 'story' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'lesson' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                  <div className="flex-1"></div>
                  <button 
                    onClick={() => toggleBookmark(item.id)}
                    className="text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    {bookmarkedIds.includes(item.id) ? 
                      <FaBookmark className="w-4 h-4 text-purple-600" /> : 
                      <FaRegBookmark className="w-4 h-4" />
                    }
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-purple-700 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{item.summary}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.split(',').map(tag => (
                    <span key={tag} className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-purple-50">
                  <Link 
                    to={`/content/${item.id}`}
                    className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center gap-1 transition-colors"
                  >
                    <FiBookOpen className="w-4 h-4" />
                    Read {item.type === 'hadith' ? 'Hadith' : item.type === 'story' ? 'Full Story' : 'Full Lesson'}
                  </Link>
                  <button className="text-gray-500 hover:text-purple-600 transition-colors">
                    <FiShare2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No content found matching your criteria.
          </div>
        )}

        {/* Pagination would be implemented here */}
      </main>

      {/* Footer (unchanged) */}
    </div>
  );
}