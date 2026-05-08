import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaFacebookMessenger,
  FaInstagram,
  FaTwitter,
  FaDiscord,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

export default function QalbiyahHomePage() {
  const slides = [
    {
      post: "Post 1",
      description: "Description for Post 1",
      link: "#",
    },
    {
      post: "Post 2",
      description: "Description for Post 2",
      link: "#",
    },
    {
      post: "Post 3",
      description: "Description for Post 3",
      link: "#",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () =>
    setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);

  const nextSlide = () =>
    setCurrentIndex((currentIndex + 1) % slides.length);

  const socialIcons = [
    { Icon: FaFacebook, hover: "#1877F2", link: "https://facebook.com" },
    { Icon: FaFacebookMessenger, hover: "#00B2FF", link: "https://messenger.com" },
    { Icon: FaInstagram, hover: "#E1306C", link: "https://instagram.com" },
    { Icon: FaTwitter, hover: "#1DA1F2", link: "https://twitter.com" },
    { Icon: FaDiscord, hover: "#5865F2", link: "https://discord.com" },
    { Icon: FaLinkedinIn, hover: "#0077B5", link: "https://linkedin.com" },
    { Icon: FaGithub, hover: "#6e5494", link: "https://github.com" },
  ].map(({ Icon, hover, link }) => ({
    icon: <Icon />,
    hover,
    link,
  }));

  const navRoutes = [
    { label: "Read Quran", route: "/read-quran-page" },
    { label: "Quran Quiz", route: "/quiz" },
    { label: "I am Feeling", route: "/feeling" },
    { label: "Tweets", route: "/tweet" },
    { label: "Donate", route: "/donation" },
  ];

  const offerRoutes = [
    {
      title: "Read Quran:",
      route: "/read-quran-page",
      desc: "Where you can read Quran in Arabic with English translation.",
      bg: "bg-gradient-to-r from-yellow-100 to-yellow-200",
    },
    {
      title: "Quran Quiz:",
      route: "/quiz",
      desc: "Where you can test your knowledge about Quran with daily quizzes.",
      bg: "bg-gradient-to-r from-pink-200 to-pink-300",
    },
    {
      title: "I am Feeling",
      route: "/feeling",
      desc: "Where we recommend Quranic verses, Hadith, and Dua based on your emotions.",
      bg: "bg-gradient-to-r from-blue-100 to-blue-200",
    },
    {
      title: "Stories & Lessons:",
      route: "/lessons",
      desc: "Where you can read Islamic lessons, stories, and Hadith.",
      bg: "bg-gradient-to-r from-red-100 to-red-200",
    },
    {
      title: "Qibla and Timing",
      route: "/qibla-namaz",
      desc: "Discover the correct Qibla direction with prayer timings.",
      bg: "bg-gradient-to-r from-indigo-100 to-indigo-200",
    },
    {
      title: "Tweet",
      route: "/tweet",
      desc: "A chat group where you can share your insights on religious matters.",
      bg: "bg-gradient-to-r from-emerald-100 to-emerald-200",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen flex flex-col font-sans">

<header className="p-6 space-y-6">

  <div className="text-center">
    <Link to="/">
      <h1 className="text-5xl font-extrabold text-purple-600 font-[cursive] tracking-wide drop-shadow-md hover:text-purple-700 transition-colors">
        Qalbiyah
      </h1>
    </Link>
    <p className="text-purple-400 mt-2 text-sm">Your Spiritual Companion</p>
  </div>

  {/* Middle Section: Navigation Links Centered */}
  <nav className="flex flex-wrap justify-center gap-6 text-sm sm:text-base font-medium">
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

  {/* Bottom Section: Search Bar Left + Buttons Right */}
  <div className="flex justify-between items-center mt-6">
    {/* Search Bar (Left) */}
    <div className="flex-1 max-w-md">
      <input
        type="text"
        placeholder="Search..."
        className="w-full px-4 py-2 rounded-full border border-purple-300 focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm"
      />
    </div>

    {/* Buttons (Right) */}
    <div className="flex gap-2 ml-4">
      {[
        
        { name: "Account", link: "/account", color: "green" },
        { name: "Contact Us", link: "/contactus", color: "purple" },

      ].map(({ name, link, color }) => (
        <Link key={name} to={link}>
          <button
            className={`border border-${color}-600 text-${color}-700 bg-${color}-100 rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-${color}-600 hover:text-white transition-all`}
          >
            {name}
          </button>
        </Link>
      ))}
    </div>
  </div>
</header>



      {/* Posts Section */}
      <section className="relative h-[24rem] sm:h-[28rem] md:h-[32rem] lg:h-[36rem] overflow-hidden mt-4">
        <a href={slides[currentIndex].link} className="block w-full h-full">
          <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-2">
              {slides[currentIndex].post}
            </h2>
            <p className="text-md text-gray-600">{slides[currentIndex].description}</p>
          </div>
        </a>
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-700 text-3xl z-10 hover:scale-110"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-700 text-3xl z-10 hover:scale-110"
        >
          ❯
        </button>
      </section>

      {/* What we offer */}
      <section className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-red-600">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {offerRoutes.map((item, index) => (
            <div
              key={index}
              className={`${item.bg} p-6 h-56 flex items-center justify-center rounded-2xl transition-shadow hover:shadow-xl shadow-md`}
            >
              <div className="text-center max-w-[90%]">
                <h3 className="font-bold text-lg mb-2 text-gray-700">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-4">“{item.desc}”</p>
                <Link to={item.route}>
                  <button className="bg-purple-700 text-white px-4 py-2 text-xs rounded-full hover:bg-purple-800 transition-all duration-300">
                    TRY IT NOW
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

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