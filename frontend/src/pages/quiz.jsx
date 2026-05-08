import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaQuran, FaArrowRight, FaHome, FaTrophy, FaHeart, FaCheck, FaTimes, FaStar, FaMoon, FaSun, FaFacebook, FaInstagram, FaTwitter, FaDiscord, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

const QuranQuizPage = () => {
  const [quizStage, setQuizStage] = useState('select-level');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const difficultyLevels = [
    {
      name: 'Beginner',
      icon: <FaSun className="text-yellow-400 text-3xl" />,
      description: 'Basic questions about well-known surahs and prophets',
      color: 'from-green-100 to-green-50'
    },
    {
      name: 'Intermediate',
      icon: <FaStar className="text-blue-400 text-3xl" />,
      description: 'Questions about surah meanings and common facts',
      color: 'from-blue-100 to-blue-50'
    },
    {
      name: 'Advanced',
      icon: <FaMoon className="text-purple-400 text-3xl" />,
      description: 'Detailed questions about verses and interpretations',
      color: 'from-purple-100 to-purple-50'
    },
    {
      name: 'Scholar',
      icon: <FaQuran className="text-red-400 text-3xl" />,
      description: 'Challenging questions about tafsir and rulings',
      color: 'from-red-100 to-red-50'
    },
    {
      name: 'Random',
      icon: <GiPerspectiveDiceSixFacesRandom className="text-indigo-400 text-3xl" />,
      description: 'Mix of all difficulty levels',
      color: 'from-indigo-100 to-indigo-50'
    }
  ];

  // Fallback questions if API fails
  const localQuestions = {
    beginner: [
      {
        question: "Which Surah is known as the 'Heart of the Quran'?",
        options: ["Al-Baqarah", "Yasin", "Ar-Rahman", "Al-Fatihah"],
        correctAnswer: "Yasin",
        explanation: "Surah Yasin (36) is referred to as the 'Heart of the Quran'."
      },
      // ... other questions
    ],
    // ... other difficulty levels
  };

  const fetchQuestions = async (difficulty) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/quiz/questions?difficulty=${difficulty}`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      setQuestions(data.questions || getLocalQuestions(difficulty));
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions(getLocalQuestions(difficulty));
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalQuestions = (difficulty) => {
    if (difficulty === 'random') {
      const allQuestions = [
        ...localQuestions.beginner,
        ...localQuestions.intermediate,
        ...localQuestions.advanced,
        ...localQuestions.scholar
      ];
      return shuffleArray(allQuestions).slice(0, 10);
    }
    return localQuestions[difficulty] || [];
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    if (quizStage !== 'in-progress' || !timeLeft) return;
    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, quizStage]);

  const handleOptionSelect = (option) => {
    if (answeredQuestions.includes(currentQuestion)) return;
    setSelectedOption(option);
    const correct = option === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setTimeLeft(15);
    } else {
      setQuizStage('completed');
      saveQuizResult();
    }
  };

  const startQuiz = (difficulty) => {
    setSelectedDifficulty(difficulty);
    fetchQuestions(difficulty);
    setQuizStage('in-progress');
  };

  const saveQuizResult = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/quiz/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          difficulty: selectedDifficulty,
          score,
          totalQuestions: questions.length
        })
      });
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  const resetQuiz = () => {
    setQuizStage('select-level');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(15);
    setAnsweredQuestions([]);
  };

  const renderDifficultySelection = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700 mb-4 flex items-center justify-center">
          <FaQuran className="mr-3" /> Quran Quiz Challenge
        </h1>
        <p className="text-xl text-gray-600">
          Select your knowledge level to begin the quiz
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {difficultyLevels.map((level, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${level.color} border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105`}
            onClick={() => startQuiz(level.name.toLowerCase())}
          >
            <div className="flex items-center mb-4">
              <div className="mr-4">{level.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800">{level.name}</h2>
            </div>
            <p className="text-gray-600 mb-4">{level.description}</p>
            <div className="flex justify-end">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-full flex items-center transition-colors">
                Select <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuizQuestion = () => {
    if (isLoading) {
      return (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-700">Loading questions...</p>
        </div>
      );
    }

    if (!questions.length) {
      return (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <p className="text-red-500 mb-4">Failed to load questions. Please try again.</p>
          <button 
            onClick={resetQuiz}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-full transition-colors"
          >
            Go Back
          </button>
        </div>
      );
    }

    const currentQ = questions[currentQuestion];
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-purple-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              timeLeft < 5 ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
            }`}>
              Time: {timeLeft}s
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-6">{currentQ.question}</h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedOption === option
                    ? isCorrect
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : 'bg-red-100 border-red-500 text-red-800'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
                onClick={() => handleOptionSelect(option)}
                disabled={answeredQuestions.includes(currentQuestion)}
              >
                {option}
              </button>
            ))}
          </div>
          
          {selectedOption && (
            <div className={`mt-4 p-4 rounded-lg ${
              isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <div className="flex items-center mb-2">
                {isCorrect ? (
                  <FaCheck className="mr-2 text-green-500" />
                ) : (
                  <FaTimes className="mr-2 text-red-500" />
                )}
                <span className="font-medium">
                  {isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${currentQ.correctAnswer}`}
                </span>
              </div>
              <p className="text-sm">{currentQ.explanation}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderQuizCompleted = () => (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-center mb-6">
          <FaTrophy className="text-5xl text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
        <p className="text-gray-600 mb-6">
          You scored {score} out of {questions.length} in {selectedDifficulty} difficulty
        </p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={resetQuiz}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-full transition-colors"
          >
            <FaHome className="inline mr-2" /> Home
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen flex flex-col font-sans">
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
            { name: "Quran Quiz", link: "/quiz", active: true },
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

      <main className="flex-grow">
        {quizStage === 'select-level' && renderDifficultySelection()}
        {quizStage === 'in-progress' && renderQuizQuestion()}
        {quizStage === 'completed' && renderQuizCompleted()}
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
};

export default QuranQuizPage;