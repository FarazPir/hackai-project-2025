import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import ChatUI from "./ChatUI";
import HelpPage from "./HelpPage"; // Import the new HelpPage component
import DiaryPage from "./DiaryPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatUI />} />
            <Route path="/help" element={<HelpPage />} /> 
            <Route path="/diary" element={<DiaryPage />} /> 
        </Routes>
    );
}

export default App;