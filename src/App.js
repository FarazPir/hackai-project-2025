import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage"; // Import your LandingPage component
import ChatUI from "./ChatUI"; // Import your ChatUI component

function App() {
  return (
    <Routes>
      {/* Set LandingPage as the home page */}
      <Route path="/" element={<LandingPage />} />
      {/* Route for ChatUI */}
      <Route path="/chat" element={<ChatUI />} />
    </Routes>
  );
}

export default App;