import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./assets/css/bootstrap.min.css";
import "./assets/css/styles.css"; // Custom styles

const ScreenshotPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("screenshot", selectedFile);

        setIsUploading(true);

        try {
            const response = await fetch("http://localhost:5000/screenshot", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Screenshot text extracted and saved successfully! Extracted text: ${data.extracted_text}`);
            } else {
                alert(`Failed to process the screenshot. Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error uploading screenshot:", error);
            alert("An error occurred while uploading the screenshot.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleExit = () => {
        navigate("/"); // Redirect to the home page
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1 class="modern-heading">Upload a Screenshot</h1>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ margin: "10px 0" }}
            />
            <div>
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
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
                    {isUploading ? "Uploading..." : "Upload"}
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

export default ScreenshotPage;