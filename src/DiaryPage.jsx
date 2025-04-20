import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "./assets/css/bootstrap.min.css";
import "./assets/css/styles.css"; // Custom styles

const DiaryPage = () => {
    const [diaryEntry, setDiaryEntry] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    const handleDiaryChange = (event) => {
        setDiaryEntry(event.target.value);
    };

    const handleSaveEntry = async () => {
        try {
            const response = await fetch("http://localhost:5000/diary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ entry: diaryEntry }),
            });

            if (response.ok) {
                alert("Your diary entry has been saved!");
                setDiaryEntry(""); // Clear the textarea after saving
            } else {
                alert("Failed to save your diary entry.");
            }
        } catch (error) {
            console.error("Error saving diary entry:", error);
            alert("An error occurred while saving your diary entry.");
        }
    };

    const handleExit = () => {
        navigate("/"); // Redirect to the home page
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1 class="modern-heading">Virtual Diary</h1>
            <textarea
                style={{
                    width: "100%",
                    height: "400px",
                    fontSize: "16px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                }}
                placeholder="Write your thoughts here..."
                value={diaryEntry}
                onChange={handleDiaryChange}
            ></textarea>
            <div style={{ marginTop: "10px" }}>
                <button
                    onClick={handleSaveEntry}
                    style={{
                        marginRight: "10px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Save Entry
                </button>
                <button
                    onClick={handleExit}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Exit
                </button>
            </div>
        </div>
    );
};

export default DiaryPage;