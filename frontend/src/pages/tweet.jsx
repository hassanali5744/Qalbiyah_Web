import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaDiscord,
  FaLinkedinIn,
  FaGithub,
  FaHeart,
  FaArrowRight,
  FaSpinner,FaReply, FaRetweet } from "react-icons/fa";
import { FiSend, FiSearch } from "react-icons/fi";

export default function CommunityPage() {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated (e.g., by checking localStorage for token)
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // You might want to decode the token to get user info
    }
    
    fetchTweets();
  }, []);

  const fetchTweets = () => {
    fetch("http://localhost:5000/api/tweets")
      .then(res => res.json())
      .then(data => setTweets(data.tweets))
      .catch(err => console.error("Error fetching tweets:", err));
  };

  const handlePostTweet = () => {
    if (!isAuthenticated) {
      alert("Please login to post a tweet");
      return;
    }

    if (newTweet.trim() && newTweet.length <= 280) {
      const token = localStorage.getItem('token');
      
      fetch("http://localhost:5000/api/tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: newTweet }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to post tweet');
          return res.json();
        })
        .then(() => {
          fetchTweets(); // Refresh the tweets list
          setNewTweet("");
        })
        .catch(err => {
          console.error("Error posting tweet:", err);
          alert("Failed to post tweet. Please try again.");
        });
    } else {
      alert("Tweet must be between 1 and 280 characters");
    }
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen flex flex-col font-sans">
      {/* Header */}
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
            { name: "Qibla and Timing", link: "/qibla-namaz" },
            { name: "Tweets", link: "/tweet", active: true },
            { name: "Donate", link: "/donation" },
          ].map(({ name, link }) => (
            <Link
              key={name}
              to={link}
              className="text-gray-600 hover:text-purple-500 transition-colors duration-300 pb-1"
            >
              {name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-12 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-purple-700 mb-3">Community Feed</h2>
          <p className="text-gray-600">
            Connect with other believers and share spiritual insights
          </p>
        </div>

        {/* Post Box */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 mb-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
              {user ? user.name.charAt(0) : "?"}
            </div>
            <div className="flex-1">
              <textarea
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                placeholder="Share a Quran verse, Hadith, or spiritual thought..."
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                rows="3"
                maxLength="280"
              ></textarea>
              <div className="flex justify-between items-center mt-3">
                <div className="text-sm text-gray-500">
                  {newTweet.length}/280 characters
                </div>
                <button
                  onClick={handlePostTweet}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition-colors"
                  disabled={!newTweet.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <FiSearch />
          </div>
          <input
            type="text"
            placeholder="Search posts by topic or user..."
            className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          />
        </div>

        {/* Tweets Feed */}
        <div className="space-y-6">
          {tweets.map(tweet => (
            <div key={tweet.id} className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                  {tweet.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-purple-700">{tweet.name}</h4>
                  <p className="text-gray-500 text-sm">@{tweet.email.split('@')[0]} · {formatDate(tweet.created_at)}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{tweet.content}</p>

              <div className="flex justify-between text-gray-500 max-w-md">
                <button className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                  <FaReply /> <span>0</span>
                </button>
                <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                  <FaRetweet /> <span>0</span>
                </button>
                <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                  <FaHeart /> <span>0</span>
                </button>
                <button className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                  <FiSend />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-white hover:bg-purple-50 text-purple-600 rounded-full border border-purple-200 transition-colors">
            Load More Posts
          </button>
        </div>
      </main>
        <footer className="bg-gradient-to-b from-purple-900 to-purple-950 text-white pt-12 pb-8 px-6 mt-16">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-purple-300 font-[cursive] mb-4">
                    Qalbiyah
                  </h2>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    Qalbiyah is your spiritual companion — read Quran, seek guidance, find peace.
                  </p>
                </div>
      
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-300">Quick Links</h3>
                  <ul className="space-y-2 text-purple-200 text-sm">
                    <li><Link to="/read-quran-page" className="hover:text-white transition-colors">Read Quran</Link></li>
                    <li><Link to="/quiz" className="hover:text-white transition-colors">Quran Quiz</Link></li>
                    <li><Link to="/feeling" className="hover:text-white transition-colors">I am Feeling</Link></li>
                  </ul>
                </div>
      
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-300">Contact</h3>
                  <ul className="space-y-3 text-purple-200 text-sm">
                    <li>Email: <a href="mailto:support@qalbiyah.com" className="hover:text-white transition-colors">support@qalbiyah.com</a></li>
                  </ul>
                </div>
      
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-300">Stay Updated</h3>
                  <form className="flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="rounded-full px-4 py-2 text-purple-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-2 text-sm transition-all duration-300 active:scale-95"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
      
              <div className="border-t border-purple-800 mt-10 pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-purple-300 text-sm">© 2025 Qalbiyah. All rights reserved.</p>
      
                  <div className="flex gap-5 text-xl text-purple-300">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      <FaFacebook />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      <FaInstagram />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      <FaTwitter />
                    </a>
                  </div>
                </div>
              </div>
            </footer>
    </div>
  );
}