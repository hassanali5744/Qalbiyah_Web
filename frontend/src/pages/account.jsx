import { Link, Route, useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { FaFacebook, FaInstagram, FaGoogle ,FaTwitter, FaDiscord, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FiUser, FiLock, FiMail } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";
import QalbiyahHomePage from "./home-page";

export default function AccountAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login API call
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        
        navigate('/'); 
        
      }
      
          else {
        // Signup API call
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match!");
        }
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
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
      <main className="flex-grow flex items-center justify-center px-6 py-0">
        <div className="w-full max-w-md">
          {/* Auth Toggle */}
          <div className="flex mb-8 border-b border-purple-200">
            <button
              className={`flex-1 py-3 font-medium ${isLogin ? 'text-purple-700 border-b-2 border-purple-600' : 'text-gray-500'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 font-medium ${!isLogin ? 'text-purple-700 border-b-2 border-purple-600' : 'text-gray-500'}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Auth Form */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-purple-100">
            <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiUser />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiMail />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiLock />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                    minLength="6"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiLock />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      required
                      minLength="6"
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-800">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : isLogin ? (
                  'Login'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full bordewr-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                <FaGoogle className="text-blue-600" />
                </button>
                <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                  <FaFacebook className="text-blue-600" />
                </button>
                <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                  <FaGithub className="text-gray-800" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

       {/* Footer */}
           <footer className="bg-gradient-to-b from-purple-900 to-purple-950 text-white pt-12 pb-8 px-6 mt-16">
             <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
               {/* Logo and About */}
               <div>
                 <h2 className="text-3xl font-extrabold text-purple-300 font-[cursive] mb-4">
                   Qalbiyah
                 </h2>
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
     
             {/* Divider */}
             <div className="border-t border-purple-800 mt-10 pt-6">
               <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                 <p className="text-purple-300 text-sm">© 2025 Qalbiyah. All rights reserved.</p>
     
                 {/* Social Links */}
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
                   <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                     <FaDiscord />
                   </a>
                   <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                     <FaLinkedinIn />
                   </a>
                   <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                     <FaGithub />
                   </a>
                 </div>
               </div>
             </div>
           </footer>
    </div>
  );
}