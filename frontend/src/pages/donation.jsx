
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaDiscord, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { FiHeart, FiCreditCard, FiDollarSign, FiShield, FiLoader } from "react-icons/fi";

export default function DonationPage() {
  const [donationOptions, setDonationOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    isRecurring: false,
    paymentMethod: "card",
    donorName: "",
    donorEmail: "",
    donorMessage: ""
  });
  const [donationSuccess, setDonationSuccess] = useState(false);

  // Fetch donation options from server
  useEffect(() => {
    const fetchDonationOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/donation-options');
        
      
        const data = await response.json();
        setDonationOptions(data.map(option => ({
          ...option,
          amount: `$${option.amount}` // Format amount with $
        })));
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDonationSubmit = async (e, presetAmount = null) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const amount = presetAmount || formData.amount;
      const numericAmount = parseFloat(amount.toString().replace('$', ''));
      
      if (isNaN(numericAmount)) {
        throw new Error('Please enter a valid donation amount');
      }

      if (numericAmount <= 0) {
        throw new Error('Donation amount must be greater than zero');
      }

      const donationData = {
        ...formData,
        amount: numericAmount,
        isRecurring: Boolean(formData.isRecurring)
      };

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers,
        body: JSON.stringify(donationData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Donation submission failed');
      }

      const result = await response.json();
      console.log('Donation successful:', result);
      setDonationSuccess(true);
      
      // Reset form
      setFormData({
        amount: "",
        isRecurring: false,
        paymentMethod: "card",
        donorName: "",
        donorEmail: "",
        donorMessage: ""
      });
    } catch (err) {
      console.error('Donation error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 1, name: "Credit/Debit Card", value: "card", icon: <FiCreditCard className="text-2xl" /> },
    { id: 2, name: "PayPal", value: "paypal", icon: <FiDollarSign className="text-2xl" /> },
    { id: 3, name: "Bank Transfer", value: "bank", icon: <FiShield className="text-2xl" /> }
  ];

  if (loading && donationOptions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (donationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full p-4 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-purple-700 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your donation has been successfully processed. May Allah reward you for your generosity.</p>
          <Link 
            to="/" 
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Return Home
          </Link>
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
            { name: "Qibla and Timing", link: "/qibla-namaz" },
            { name: "Tweets", link: "/tweet" },
            { name: "Donate", link: "/donation", active: true },
          ].map(({ name, link }) => (
            <Link
              key={name}
              to={link}
              className={`text-gray-600 hover:text-purple-500 transition-colors duration-300 pb-1 ${
                link === "/donation" ? "text-purple-600 font-semibold" : ""
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6 py-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-purple-100 text-purple-700 rounded-full p-3 mb-4">
            <FiHeart className="text-xl" />
          </div>
          <h2 className="text-4xl font-extrabold text-purple-700 mb-3">Support Qalbiyah</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your donation helps us maintain and improve this spiritual platform for millions of users worldwide
          </p>
        </div>

        {/* Donation Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {donationOptions.map((option) => (
            <div 
              key={option.id} 
              className={`relative p-6 rounded-xl shadow-md border-2 transition-all hover:shadow-lg ${
                option.popular 
                  ? "border-purple-500 bg-purple-50 transform -translate-y-2" 
                  : "border-purple-100 bg-white"
              }`}
            >
              {option.popular && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-2xl font-bold text-purple-700 mb-2">{option.title}</h3>
              <p className="text-3xl font-extrabold text-purple-600 mb-3">{option.amount}</p>
              <p className="text-gray-600 mb-4">{option.description}</p>
              
              <ul className="space-y-2 mb-6">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={(e) => {
                  setFormData({
                    ...formData,
                    amount: option.amount.replace('$', '')
                  });
                  handleDonationSubmit(e, option.amount.replace('$', ''));
                }}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold transition-colors flex items-center justify-center ${
                  option.popular 
                    ? "bg-purple-600 hover:bg-purple-700 text-white" 
                    : "bg-white text-purple-600 border border-purple-600 hover:bg-purple-50"
                } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? <FiLoader className="animate-spin mr-2" /> : null}
                Donate Now
              </button>
            </div>
          ))}
        </div>

        {/* Custom Donation Form */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-purple-100 mb-12">
          <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center">Or Give a Custom Amount</h3>
          
          <form onSubmit={handleDonationSubmit} className="max-w-md mx-auto">
            <div className="mb-6">
              <label htmlFor="amount" className="block text-gray-700 mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input 
                  type="number" 
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required
                  className="w-full pl-8 pr-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {[10, 25, 50, 100, 250, 500].map((amount) => (
                <button 
                  key={amount} 
                  type="button"
                  onClick={() => setFormData({...formData, amount: amount.toString()})}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    formData.amount === amount.toString() 
                      ? "bg-purple-600 text-white" 
                      : "bg-purple-100 hover:bg-purple-200 text-purple-700"
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded"
                />
                <span className="ml-2 text-gray-700">Make this a monthly recurring donation</span>
              </label>
            </div>
            
            <div className="mb-6">
              <label htmlFor="donorName" className="block text-gray-700 mb-2">Your Name (Optional)</label>
              <input 
                type="text" 
                id="donorName"
                name="donorName"
                value={formData.donorName}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="donorEmail" className="block text-gray-700 mb-2">Email (Optional)</label>
              <input 
                type="email" 
                id="donorEmail"
                name="donorEmail"
                value={formData.donorEmail}
                onChange={handleInputChange}
                placeholder="Enter your email for receipt"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="donorMessage" className="block text-gray-700 mb-2">Message (Optional)</label>
              <textarea 
                id="donorMessage"
                name="donorMessage"
                value={formData.donorMessage}
                onChange={handleInputChange}
                placeholder="Any special instructions or prayers"
                rows="3"
                className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-3">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentMethods.map(method => (
                  <label 
                    key={method.id}
                    className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer ${
                      formData.paymentMethod === method.value 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-purple-600 mb-2">{method.icon}</div>
                    <span className="text-sm text-center">{method.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center"
            >
              {loading ? <FiLoader className="animate-spin mr-2" /> : null}
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          </form>
        </div>

        {/* Payment Methods Info */}
        <div className="bg-purple-50 p-8 rounded-xl">
          <h3 className="text-2xl font-bold text-purple-700 mb-6 text-center">Secure Payment Methods</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <div 
                key={method.id} 
                className="bg-white p-6 rounded-lg shadow-sm border border-purple-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="text-purple-600 mb-3">{method.icon}</div>
                <h4 className="font-bold text-purple-700 mb-2">{method.name}</h4>
                <p className="text-gray-600 text-sm">Safe and secure payment processing</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-500">
            <FiShield className="text-purple-500" />
            <span>All donations are securely processed and encrypted</span>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-purple-700 mb-6">Your Donation Makes a Difference</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { stat: "50,000+", description: "Monthly active users" },
              { stat: "100%", description: "Free access maintained" },
              { stat: "24/7", description: "Service availability" }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
                <p className="text-4xl font-bold text-purple-600 mb-2">{item.stat}</p>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            With your support, we can continue providing free spiritual resources, develop new features, 
            and reach more people seeking guidance and peace through Islam.
          </p>
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