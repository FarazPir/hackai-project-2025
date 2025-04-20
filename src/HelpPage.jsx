import React from "react";
import "./assets/css/bootstrap.min.css";
import "./assets/css/styles.css";

const HelpPage = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
            <div className="container text-center">
                <h1 className="mb-4">We're Here to Help</h1>
                <p>If you or someone you know is in a domestic abuse situation, here are some resources to help you:</p>
                
                <div className="mt-4">
                    <h3>Hotlines</h3>
                    <ul className="list-unstyled">
                        <li><strong>National Domestic Violence Hotline:</strong> <a href="tel:1-800-799-7233">1-800-799-7233</a></li>
                        <li><strong>Text Hotline:</strong> Text <strong>"START"</strong> to <a href="sms:88788">88788</a></li>
                        <li><strong>Emergency:</strong> Dial <a href="tel:911">911</a></li>
                    </ul>
                </div>

                <div className="mt-4">
                    <h3>Online Resources</h3>
                    <ul className="list-unstyled">
                        <li><a href="https://www.thehotline.org" target="_blank" rel="noopener noreferrer">National Domestic Violence Hotline</a></li>
                        <li><a href="https://www.rainn.org/" target="_blank" rel="noopener noreferrer">RAINN (Rape, Abuse & Incest National Network)</a></li>
                        <li><a href="https://www.womensaid.org.uk/" target="_blank" rel="noopener noreferrer">Women's Aid</a></li>
                    </ul>
                </div>

                <div className="mt-4">
                    <h3>Local Shelters and Support</h3>
                    <p>Contact your local community centers or shelters for additional assistance.</p>
                </div>

                <div className="mt-5">
                    <button className="btn btn-primary" onClick={() => window.history.back()}>Go Back</button>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;