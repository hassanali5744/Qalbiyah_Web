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

const surahGroups = [
  ["Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus"],
  ["Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha"],
  ["Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum"],
  ["Luqman", "As-Sajda", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir"],
  ["Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiya", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf"],
  ["Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'a", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahina"],
  ["As-Saff", "Al-Jumu'a", "Al-Munafiqun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haaqqa", "Al-Ma'arij", "Nuh"],
  ["Al-Jinn", "Al-Muzzammil", "Al-Muddathir", "Al-Qiyama", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa", "At-Takwir"],
  ["Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams"],
  ["Al-Lail", "Ad-Duhaa", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyina", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'a"],
  ["At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraish", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad"],
  ["Al-Ikhlas", "Al-Falaq", "An-Nas", "Dua"],
];

export default function ReadQuranPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const socialIcons = [
    { icon: <FaFacebook />, hover: "#1877F2", link: "https://facebook.com" },
    { icon: <FaFacebookMessenger />, hover: "#00B2FF", link: "https://messenger.com" },
    { icon: <FaInstagram />, hover: "#E1306C", link: "https://instagram.com" },
    { icon: <FaTwitter />, hover: "#1DA1F2", link: "https://twitter.com" },
    { icon: <FaDiscord />, hover: "#5865F2", link: "https://discord.com" },
    { icon: <FaLinkedinIn />, hover: "#0077B5", link: "https://linkedin.com" },
    { icon: <FaGithub />, hover: "#6e5494", link: "https://github.com" },
  ];

  // Flatten all surahs and filter based on search
  const filteredSurahs = surahGroups.flat().filter((surah) =>
    surah.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="p-6 space-y-6">
        {/* Top Section: Logo + Tagline Centered */}
        <div className="text-center">
          <Link to="/">
            <h1 className="text-5xl font-extrabold text-purple-600 font-[cursive] tracking-wide drop-shadow-md hover:text-purple-700 transition-colors">
              Qalbiyah
            </h1>
          </Link>
          <p className="text-purple-400 mt-2 text-sm">Your Spiritual Companion</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-sm sm:text-base font-medium">
          {[
            { name: "Read Quran", link: "/read-quran-page", active: true },
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

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8 px-4">
          <input
            type="text"
            placeholder="Search Surah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-4 pr-4 py-2 text-sm rounded-full border border-purple-300 bg-white shadow-md focus:ring-2 focus:ring-purple-500 w-full sm:w-72"
          />
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

      {/* Surah Grid */}
      <main className="px-6 py-8 flex-grow">
        {searchTerm ? (
          <section className="mb-10">
            <h3 className="text-2xl font-semibold mb-5 text-center text-purple-700">
              Search Results
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-5">
              {filteredSurahs.length > 0 ? (
                filteredSurahs.map((surah, index) => {
                  const surahNumber = surahGroups.flat().indexOf(surah) + 1;
                  return (
                    <Link
                      key={surahNumber}
                      to={`/sub?surah=${surahNumber}`}
                      className="relative group overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                    >
                      <div
                        className="h-32 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(/pic-${surahNumber % 21 || 1}.jpeg)`,
                        }}
                      >
                        <div className="bg-black bg-opacity-50 h-full w-full flex flex-col justify-center items-center text-white p-2 transition-all duration-300 group-hover:bg-opacity-70">
                          <p className="text-xs uppercase tracking-wider">Surah</p>
                          <h4 className="text-lg font-bold">{surahNumber}. {surah}</h4>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="text-center text-gray-500">No Surahs found.</p>
              )}
            </div>
          </section>
        ) : (
          surahGroups.map((group, groupIndex) => (
            <section key={groupIndex} className="mb-10">
              <h3 className="text-2xl font-semibold mb-5 text-center text-purple-700">
                Surah {groupIndex * 10 + 1} – {groupIndex * 10 + group.length}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-5">
                {group.map((surah, index) => {
                  const surahNumber = groupIndex * 10 + index + 1;
                  return (
                    <Link
                      key={surahNumber}
                      to={`/sub?surah=${surahNumber}`}
                      className="relative group overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                    >
                      <div
                        className="h-32 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(/pic-${surahNumber % 21 || 1}.jpeg)`,
                        }}
                      >
                        <div className="bg-black bg-opacity-50 h-full w-full flex flex-col justify-center items-center text-white p-2 transition-all duration-300 group-hover:bg-opacity-70">
                          <p className="text-xs uppercase tracking-wider">Surah</p>
                          <h4 className="text-lg font-bold">{surahNumber}. {surah}</h4>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>

    </div>
  );
}