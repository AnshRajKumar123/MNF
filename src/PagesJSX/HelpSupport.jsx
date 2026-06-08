import React, { useState } from "react";
import AnotherNav from "./AnotherNav";
import "../PagesCSS/HelpSupport.css";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../ComponentJSX/Toast";

const HelpSupport = () => {
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("How can we help you?");

    const navigate = useNavigate();

    const options = [
        "I have an issue with my MNF Order.",
        "My MNF app is not working.",
        "I want to share feedback or a suggestion.",
    ];

    const faqs = {
        "I have an issue with my MNF Order.": [
            "Where is my order?",
            "I got a wrong/partial order.",
            "Delivery partner misbehaved.",
            "Refund not received.",
        ],
        "My MNF app is not working.": [
            "App is crashing.",
            "Notifications not coming.",
            "Payment not going through.",
        ],
        "I want to share feedback or a suggestion.": [
            "I want to appreciate a delivery partner.",
            "I want to suggest a feature.",
            "Report app UX/UI issue.",
        ],
    };

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: "",
    });

    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const showToast = (msg, type = "success") => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false }), 2500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (selected === "How can we help you?") return "Please select a help topic";
        if (!formData.fullName.trim()) return "Full Name is required";
        if (!/\S+@\S+\.\S+/.test(formData.email))
            return "Enter a valid Email Address";
        if (formData.message.length < 10)
            return "Message must be at least 10 characters";

        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const error = validate();
        if (error) return showToast(error, "error");

        showToast("Support request submitted!");

        setTimeout(() => {
            navigate("/help-success");
        }, 1000);

        setTimeout(() => {
            navigate("/help-success");
        }, 800);
    };

    const handleScreenshot = (e) => {
        const file = e.target.files[0];
        setScreenshot(file);

        if (file && file.type.startsWith("image/")) {
            setScreenshotPreview(URL.createObjectURL(file));
        } else {
            setScreenshotPreview(null);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setScreenshot(file);

        if (file.type.startsWith("image/")) {
            setScreenshotPreview(URL.createObjectURL(file));
        }
    };

    return (
        <>
            <AnotherNav />

            {toast.show && <Toast message={toast.message} type={toast.type} />}

            <section className="HelpSection">
                <section className="HelpSectBanner">
                    <h1>We would love to help you !!</h1>
                </section>

                <section className="HelpFormSection">
                    <form className="HelpForm" onSubmit={handleSubmit}>
                        {/* Dropdown */}
                        <div>
                            <div className="DropHeader" onClick={() => setOpen(!open)}>
                                <div className="inputAcc"></div>
                                <span className="SelectHelp">{selected}</span>
                                <span className={`Arrow ${open ? "Rotate" : ""}`}>
                                    <i className="ri-arrow-down-s-fill"></i>
                                </span>
                            </div>

                            {open && (
                                <ul className="DropList">
                                    {options.map((opt, i) => (
                                        <li
                                            key={i}
                                            className="DropItem"
                                            onClick={() => {
                                                setSelected(opt);
                                                setOpen(false);
                                            }}
                                        >
                                            {opt}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Suggested FAQs */}
                        {selected !== "How can we help you?" && (
                            <div className="FAQBox">
                                <h3>Suggested Help</h3>
                                <ul>
                                    {faqs[selected].map((f, i) => (
                                        <li key={i} className="faqListItem">
                                            <i className="ri-question-line"></i> <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Inputs */}
                        <div className="input-box">
                            <span className="input-accent"></span>
                            <input
                                name="fullName"
                                type="text"
                                className="input-field"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <label className="input-label">Full Name</label>
                        </div>

                        <div className="input-box">
                            <span className="input-accent"></span>
                            <input
                                name="email"
                                type="email"
                                className="input-field"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <label className="input-label">Email Address</label>
                        </div>

                        <div className="input-box">
                            <span className="input-accent"></span>
                            <input
                                name="phone"
                                type="text"
                                className="input-field"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <label className="input-label">Phone Number (Optional)</label>
                        </div>

                        <div className="input-box TextAreaBox">
                            <span className="input-accent"></span>
                            <textarea
                                name="message"
                                className="input-field"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                            <label className="input-label">Type your message</label>
                            <div className="char-count">{formData.message.length}/400</div>
                        </div>

                        <div
                            className="upload-box"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {!screenshot ? (
                                <div className="upload-content">
                                    <i className="bx bx-image-add upload-icon"></i>
                                    <p>Drop screenshot here or <span>browse</span></p>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleScreenshot}
                                    />
                                </div>
                            ) : (
                                <div className="upload-preview">
                                    {screenshotPreview && (
                                        <img src={screenshotPreview} alt="screenshot" />
                                    )}
                                    <button
                                        className="remove-file-btn"
                                        onClick={() => {
                                            setScreenshot(null);
                                            setScreenshotPreview(null);
                                        }}
                                    >
                                        Remove Screenshot
                                    </button>
                                </div>
                            )}
                        </div>


                        <button className="SubmitButton">Submit</button>
                    </form>

                    {/* Right Side Boxes */}
                    <div className="infoReportBoxes">
                        <div className="SafetyEmergency">
                            <h1>Report a Safety Emergency</h1>
                            <p>
                                We are committed to the safety of <br /> everyone using MNF.
                            </p>
                            <Link to="/report-fraud">Report here</Link>
                        </div>

                        <div className="SafetyEmergency">
                            <h1>Issue with your live order?</h1>
                            <p>
                                Go to <strong>Support / Order Help</strong> in your MNF App to
                                talk to customer support instantly.
                            </p>
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
};

export default HelpSupport;