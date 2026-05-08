import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaDiscord, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FiCompass, FiClock, FiCalendar, FiMapPin } from "react-icons/fi";
import axios from "axios";

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [qiblaData, setQiblaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("Lahore");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch prayer times
        const prayerResponse = await axios.get('http://localhost:5000/api/prayer-times', {
          params: { location }
        });
        setPrayerTimes(prayerResponse.data);
        
        // Fetch qibla direction
        const qiblaResponse = await axios.get('http://localhost:5000/api/qibla-direction', {
          params: { location }
        });
        setQiblaData(qiblaResponse.data);
        
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-700">Loading prayer times...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h3 className="text-xl font-bold text-purple-700 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            { name: "Qibla and Timing", link: "/qibla-namaz", active: true },
            { name: "Tweets", link: "/tweet" },
            { name: "Donate", link: "/donation" },
          ].map(({ name, link, active }) => (
            <Link
              key={name}
              to={link}
              className={`${active ? 'text-purple-700 font-bold border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-500'} transition-colors duration-300 pb-1`}
            >
              {name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-purple-700 mb-3">Prayer Times & Qibla</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find accurate prayer times for your location and the direction of Qibla
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prayer Times Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-purple-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                <FiClock className="text-purple-500" /> Prayer Times
              </h3>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <FiMapPin className="text-purple-500" />
                {prayerTimes.location}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 pb-4 border-b border-purple-100">
              <span className="text-gray-500">Today</span>
              <span className="text-purple-600 font-medium flex items-center gap-1">
                <FiCalendar className="text-purple-500" /> {prayerTimes.date}
              </span>
            </div>

            <div className="space-y-4">
              {[
                { name: "Fajr", time: prayerTimes.fajr, icon: "🌄" },
                { name: "Sunrise", time: prayerTimes.sunrise, icon: "☀️" },
                { name: "Dhuhr", time: prayerTimes.dhuhr, icon: "🕛" },
                { name: "Asr", time: prayerTimes.asr, icon: "🌇" },
                { name: "Maghrib", time: prayerTimes.maghrib, icon: "🌆" },
                { name: "Isha", time: prayerTimes.isha, icon: "🌙" },
              ].map((prayer) => (
                <div key={prayer.name} className="flex items-center justify-between p-3 hover:bg-purple-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{prayer.icon}</span>
                    <span className="font-medium text-gray-700">{prayer.name}</span>
                  </div>
                  <span className="font-semibold text-purple-700">{prayer.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-purple-100">
              <LocationSelector 
                currentLocation={location}
                onChangeLocation={handleLocationChange}
              />
            </div>
          </div>

          {/* Qibla Direction Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-purple-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
                <FiCompass className="text-purple-500" /> Qibla Direction
              </h3>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <FiMapPin className="text-purple-500" />
                {qiblaData.fromLocation}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative w-48 h-48 mb-6">
                {/* Compass Visualization */}
                <div className="absolute inset-0 rounded-full border-4 border-purple-200 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border-2 border-purple-100 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-purple-50 flex items-center justify-center">
                      <div className="relative w-24 h-24">
                        {/* Compass Directions */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-purple-700 font-bold">
                          N
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-purple-700 font-bold">
                          S
                        </div>
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-purple-700 font-bold">
                          W
                        </div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-purple-700 font-bold">
                          E
                        </div>
                        
                        {/* Qibla Indicator - rotates based on degrees */}
                        <div 
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 
                          border-l-[15px] border-l-transparent border-b-[25px] border-b-purple-600 border-r-[15px] border-r-transparent"
                          style={{ transform: `translate(-50%, -50%) rotate(${parseInt(qiblaData.degrees)}deg)` }}
                        >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold text-purple-700 mb-1">{qiblaData.direction}</p>
                <p className="text-gray-600">{qiblaData.degrees} from North</p>
                <p className="text-gray-500 text-sm mt-2">Distance: {qiblaData.distance}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-100">
              <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                Find Qibla with Compass
              </button>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-12 bg-purple-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-purple-700 mb-4">More Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
              <h4 className="font-medium text-purple-700 mb-2">Monthly Calendar</h4>
              <p className="text-gray-600 text-sm">View prayer times for the entire month</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
              <h4 className="font-medium text-purple-700 mb-2">Notifications</h4>
              <p className="text-gray-600 text-sm">Get reminders before each prayer</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
              <h4 className="font-medium text-purple-700 mb-2">Masjid Finder</h4>
              <p className="text-gray-600 text-sm">Find nearby mosques</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-purple-900 to-purple-950 text-white pt-12 pb-8 px-6 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <h2 className="text-3xl font-extrabold text-purple-300 font-[cursive] mb-4">Qalbiyah</h2>
            <p className="text-purple-200 text-sm leading-relaxed">
              Qalbiyah is your spiritual companion — read Quran, seek guidance, find peace.
              Our mission is to spread positivity, love, and light through the teachings of Islam.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Quick Links</h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li><Link to="/read-quran-page" className="hover:text-white transition-colors">Read Quran</Link></li>
              <li><Link to="/quiz" className="hover:text-white transition-colors">Quran Quiz</Link></li>
              <li><Link to="/feeling" className="hover:text-white transition-colors">I am Feeling</Link></li>
              <li><Link to="/contactus" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/donation" className="hover:text-white transition-colors">Donate</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Contact</h3>
            <ul className="space-y-3 text-purple-200 text-sm">
              <li>Email: <a href="mailto:support@qalbiyah.com" className="hover:text-white transition-colors">support@qalbiyah.com</a></li>
              <li>Location: Lahore, Pakistan</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Stay Updated</h3>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-full px-4 py-2 text-purple-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://www.facebook.com/Qalbiyah" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-white transition-colors">
              <FaFacebook size={24} />
            </a>
            <a href="https://www.instagram.com/Qalbiyah" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-white transition-colors">
              <FaInstagram size={24} />
            </a>
            <a href="https://twitter.com/Qalbiyah" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-white transition-colors">
              <FaTwitter size={24} />
            </a>
            <a href="https://discord.com/invite/Qalbiyah" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-white transition-colors">
              <FaDiscord size={24} />
            </a>
            <a href="https://www.linkedin.com/company/Qalbiyah" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-white transition-colors">
              <FaLinkedinIn size={24} />
            </a>
            <a href="https://github.com/Qalbiyah" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-white transition-colors">
              <FaGithub size={24} />
            </a>
          </div>

          <p className="text-purple-200 text-sm">&copy; {new Date().getFullYear()} Qalbiyah. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Location Selector Component
function LocationSelector({ currentLocation, onChangeLocation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const popularLocations = [
    "Lahore", "Karachi", "Islamabad", "Peshawar", 
    "Quetta", "Dubai", "London", "New York"
  ];

  const filteredLocations = popularLocations.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
      >
        Change Location
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-purple-100">
          <div className="p-3">
            <input
              type="text"
              placeholder="Search location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-purple-200 rounded mb-2"
            />
            <div className="max-h-60 overflow-y-auto">
              {filteredLocations.map(loc => (
                <button
                  key={loc}
                  onClick={() => {
                    onChangeLocation(loc);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`w-full text-left p-2 hover:bg-purple-50 ${currentLocation === loc ? 'bg-purple-100' : ''}`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}