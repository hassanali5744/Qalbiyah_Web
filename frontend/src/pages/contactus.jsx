import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaDiscord, FaLinkedinIn, FaGithub, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { FiUsers, FiBook, FiHeart } from "react-icons/fi";

export default function AboutContactPage() {
  const teamMembers = [
    { name: "Sunan&Hassan", role: "Founder & Developer", bio: "Passionate about creating spiritual tech solutions" },
    { name: "Uzair Ahmad", role: "Quran Expert", bio: "10+ years of Islamic studies experience" },
    { name: "Humbal Hassan", role: "Community Manager", bio: "Connecting users with spiritual resources" }
  ];

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
            { name: "Tweets", link: "/tweets" },
            { name: "About Us", link: "/about" },
            { name: "Donate", link: "/donate" },
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
      <main className="flex-grow px-6 py-12 max-w-5xl mx-auto">
        {/* About Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-purple-700 mb-3">About Qalbiyah</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Connecting hearts to the Divine through technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="text-purple-600 mb-4">
                <FiBook className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To make Islamic knowledge accessible, understandable, and actionable for Muslims worldwide through innovative digital solutions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="text-purple-600 mb-4">
                <FiHeart className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-2">Our Vision</h3>
              <p className="text-gray-600">
                Become the leading spiritual companion app that helps Muslims strengthen their faith and connection with Allah.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="text-purple-600 mb-4">
                <FiUsers className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-2">Our Community</h3>
              <p className="text-gray-600">
                Serving over 100,000 users across 50+ countries with authentic Islamic content and spiritual guidance.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-purple-700 mb-8 text-center">Meet Our Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 text-center">
                  <div className="w-24 h-24 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center text-purple-600 text-2xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <h4 className="text-xl font-bold text-purple-700">{member.name}</h4>
                  <p className="text-purple-600 mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-xl shadow-md border border-purple-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-purple-700 mb-2">Contact Us</h2>
            <p className="text-gray-600">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-purple-600 mt-1">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-700 mb-1">Our Location</h4>
                    <p className="text-gray-600">123 Islamic Center Road, Lahore, Pakistan</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-purple-600 mt-1">
                    <FaPhone />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-700 mb-1">Phone</h4>
                    <p className="text-gray-600">+92 300 1234567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-purple-600 mt-1">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-700 mb-1">Email</h4>
                    <p className="text-gray-600">support@qalbiyah.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-bold text-purple-700 mb-3">Follow Us</h4>
                <div className="flex gap-4 text-xl text-purple-600">
                  <a href="#" className="hover:text-purple-800 transition-colors"><FaFacebook /></a>
                  <a href="#" className="hover:text-purple-800 transition-colors"><FaInstagram /></a>
                  <a href="#" className="hover:text-purple-800 transition-colors"><FaTwitter /></a>
                  <a href="#" className="hover:text-purple-800 transition-colors"><FaDiscord /></a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

    
      <footer className="bg-gradient-to-b from-purple-900 to-purple-950 text-white pt-12 pb-8 px-6 mt-16">
        
      </footer>
    </div>
  );
}