import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QalbiyahHomePage from "./pages/home-page";
import ReadQuranPage from "./pages/read-quran-page";
import IamFeeling from "./pages/feeling";
import QuranQuiz from "./pages/quiz";
import Lessons from "./pages/lessons";
import QiblaandTimings from "./pages/qibla-namaz";
import Donation from "./pages/donation";
import Contact from "./pages/contactus";
import Tweet from "./pages/tweet";
import Account from "./pages/account";
import ContentDetailPage from "./pages/content";
import Subread from "./pages/sub";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QalbiyahHomePage />} />
        <Route path="/content/:id" element={<ContentDetailPage />} />
        <Route path="/read-quran-page" element={<ReadQuranPage />} />
        <Route path="/sub" element={<Subread />} />

        <Route path="/quiz" element={<QuranQuiz/>} />
        <Route path="/feeling" element={<IamFeeling />} />
        <Route path="/tweet" element={<Tweet/>} />
        <Route path="/about" element={<div>About Us</div>} />
        <Route path="/donation" element={<Donation/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/contactus" element={<Contact/>} />
        <Route path="/lessons" element={<Lessons/>} />
        <Route path="/qibla-namaz" element={<QiblaandTimings/>} />
      </Routes>
    </Router>
  );
}

export default App;
