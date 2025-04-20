import React from "react";
import { useNavigate } from "react-router-dom";
import "./assets/css/bootstrap.min.css";
import "./assets/css/styles.css"; // Custom styles

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            {/* Removed bg-white */}
            <div className="text-center">
                <h1 className="mb-4 modern-heading">What do you feel like doing?</h1>
                <div className="container-sm">
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        <div className="row row-cols-2 gy-5 text-center">
                            <div className="col d-flex justify-content-center">
                                <button
                                    className="circle text-white d-flex flex-column align-items-center justify-content-center modern-button"
                                    onClick={() => navigate("/chat")}
                                >
                                    <i className="bi bi-chat-dots fs-3"></i>
                                    <p className="mb-0 mt-2">I want to talk</p>
                                </button>
                            </div>

                            <div className="col d-flex justify-content-center">
                                <button className="circle text-white d-flex flex-column align-items-center justify-content-center modern-button">
                                    <i className="bi bi-journal fs-3"></i>
                                    <p className="mb-0 mt-2">I want to write</p>
                                </button>
                            </div>

                            <div className="col d-flex justify-content-center">
                                <button className="circle text-white d-flex flex-column align-items-center justify-content-center modern-button">
                                    <i className="bi bi-eye fs-1"></i>
                                    <p className="mb-0 mt-2">I want to show you something</p>
                                </button>
                            </div>

                            <div className="col d-flex justify-content-center">
                                <button className="circle text-white d-flex flex-column align-items-center justify-content-center modern-button">
                                    <i className="bi bi-telephone fs-3"></i>
                                    <p className="mb-0 mt-2">I need help</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;