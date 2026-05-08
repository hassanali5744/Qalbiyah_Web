import React, { useState, useEffect } from "react";
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
  FaSpinner
} from "react-icons/fa";

export default function FeelingsPage() {
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [surahSuggestions, setSurahSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const feelings = [
    { feeling: "Happy", color: "bg-gradient-to-br from-yellow-300 to-yellow-500", emoji: "😊" },
    { feeling: "Sad", color: "bg-gradient-to-br from-blue-400 to-blue-600", emoji: "😢" },
    { feeling: "Anxious", color: "bg-gradient-to-br from-purple-400 to-purple-600", emoji: "😰" },
    { feeling: "Grateful", color: "bg-gradient-to-br from-green-400 to-green-600", emoji: "🙏" },
    { feeling: "Angry", color: "bg-gradient-to-br from-red-400 to-red-600", emoji: "😠" },
    { feeling: "Calm", color: "bg-gradient-to-br from-teal-300 to-teal-500", emoji: "😌" },
    { feeling: "Lonely", color: "bg-gradient-to-br from-gray-400 to-gray-600", emoji: "😔" },
    { feeling: "Excited", color: "bg-gradient-to-br from-pink-400 to-pink-600", emoji: "🤩" },
    { feeling: "Confused", color: "bg-gradient-to-br from-indigo-400 to-indigo-600", emoji: "😕" },
    { feeling: "Tired", color: "bg-gradient-to-br from-orange-400 to-orange-600", emoji: "😴" },
  ];

  const fetchSurahSuggestions = async (feeling) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/feelings/suggestions?feeling=${feeling}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setSurahSuggestions(data.suggestions);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Failed to load suggestions. Please try again.');
      setSurahSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeelingSelect = (feeling) => {
    setSelectedFeeling(feeling);
    setShowSuggestions(true);
    fetchSurahSuggestions(feeling);
    
    setTimeout(() => {
      const element = document.getElementById("suggestions");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
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
            { name: "I am Feeling", link: "/feeling", active: true },
            { name: "Qibla and Timing", link: "/qibla-namaz" },
            { name: "Tweets", link: "/tweet" },
            { name: "Donate", link: "/donation" },
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
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-purple-700 mb-4">
            How Are You Feeling Today?
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Select your current emotion to get personalized Quranic guidance
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {feelings.map(({ feeling, color, emoji }) => (
              <button
                key={feeling}
                className={`${color} text-white font-bold py-4 px-2 rounded-xl shadow-md hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center ${
                  selectedFeeling === feeling ? "ring-4 ring-purple-300" : ""
                }`}
                onClick={() => handleFeelingSelect(feeling)}
              >
                <span className="text-2xl mb-1">{emoji}</span>
                {feeling}
              </button>
            ))}
          </div>

          {showSuggestions && selectedFeeling && (
            <div id="suggestions" className="mt-12 bg-white p-6 rounded-xl shadow-lg border border-purple-100">
              <div className="flex items-center mb-4">
                <FaHeart className="text-red-500 mr-2 text-xl" />
                <h3 className="text-2xl font-semibold text-purple-700">
                  Recommended Surahs for <span className="capitalize">{selectedFeeling.toLowerCase()}</span> mood
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                These surahs may help you find peace and guidance in your current state:
              </p>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin text-purple-500 text-4xl mx-auto mb-4" />
                  <p>Loading suggestions...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  {error}
                </div>
              ) : surahSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {surahSuggestions.map((surah, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                      <div className="flex items-start">
                        <div className="bg-purple-600 text-white p-2 rounded-lg mr-4">
                          {surah.surah_number}
                        </div>
                        <div>
                          <h4 className="font-bold text-purple-800">
                            {surah.surah_name} ({surah.surah_number}:{surah.ayat_number})
                          </h4>
                          <p className="text-gray-600 text-sm">{surah.ayat_text}</p>
                          <p className="text-gray-500 text-xs mt-1">{surah.explanation}</p>
                          <Link 
                            to={`/read-quran-page?surah=${surah.surah_number}`}
                            className="inline-flex items-center text-purple-600 hover:text-purple-800 mt-2 text-sm font-medium"
                          >
                            Read now <FaArrowRight className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No suggestions found for this feeling.
                </div>
              )}
              
              <div className="mt-6 text-center">
                <Link to="/read-quran-page">
                  <button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all flex items-center mx-auto">
                    Explore More Surahs
                    <FaArrowRight className="ml-2" />
                  </button>
                </Link>
              </div>
            </div>
          )}
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