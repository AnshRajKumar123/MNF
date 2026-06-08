import React, { useState } from "react";
import AnotherNav from "./AnotherNav";
import "../PagesCSS/ReportFraud.css";
import { Link } from "react-router-dom";
import Toast from "../ComponentJSX/Toast"; // your existing toast component

const ReportFraud = () => {
    const [evidencePreview, setEvidencePreview] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        accusedName: "",
        city: "",
        message: "",
    });

    const handleFile = (e) => {
        const file = e.target.files[0];
        setEvidence(file);

        if (file && file.type.startsWith("image/")) {
            setEvidencePreview(URL.createObjectURL(file));
        } else {
            setEvidencePreview(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setEvidence(file);

        if (file && file.type.startsWith("image/")) {
            setEvidencePreview(URL.createObjectURL(file));
        }
    };

    const [reason, setReason] = useState("");
    const [evidence, setEvidence] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const showToast = (msg, type = "success") => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false }), 2500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) return "Full Name is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email address";
        if (!/^[0-9]{10}$/.test(formData.mobile))
            return "Mobile number must be 10 digits";
        if (!reason) return "Please select the fraud type";
        if (formData.message.length < 20)
            return "Message must be at least 20 characters";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            showToast(error, "error");
            return;
        }

        setLoading(true);

        // Simulate backend API request
        await new Promise((res) => setTimeout(res, 1500));

        setLoading(false);
        showToast("Fraud report submitted successfully!");

        // Reset form
        setFormData({
            fullName: "",
            email: "",
            mobile: "",
            accusedName: "",
            city: "",
            message: "",
        });
        setReason("");
        setEvidence(null);

        setTimeout(() => {
            window.location.href = "/fraud-success";
        }, 800);
    };

    const fraudReasons = [
        "Payment Fraud",
        "Fake Order Activity",
        "Scam Call / Message",
        "Suspicious Profile",
        "Impersonation of MNF Team",
        "Other",
    ];

    return (
        <>
            <AnotherNav />

            {toast.show && <Toast message={toast.message} type={toast.type} />}

            <section className="ReportSection">
                <section className="HelpSectBanner">
                    <h1>Report a Potential Fraud</h1>
                </section>

                <section className="HelpFormSection">
                    <form className="HelpForm" onSubmit={handleSubmit}>
                        {/* Full Name */}
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

                        {/* Email */}
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

                        {/* Mobile */}
                        <div className="input-box">
                            <span className="input-accent"></span>
                            <input
                                name="mobile"
                                type="text"
                                className="input-field"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                            <label className="input-label">Mobile Number</label>
                        </div>

                        {/* Accused Name */}
                        <div className="input-box">
                            <span className="input-accent"></span>
                            <input
                                name="accusedName"
                                type="text"
                                className="input-field"
                                value={formData.accusedName}
                                onChange={handleChange}
                                required
                            />
                            <label className="input-label">
                                Person / Organization Being Reported
                            </label>
                        </div>

                        {/* City */}
                        <div className="input-box">
                            <span className="input-accent"></span>
                            <input
                                name="city"
                                type="text"
                                className="input-field"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                            <label className="input-label">City</label>
                        </div>

                        {/* Fraud Type Section */}
                        <div className="fraud-reason-section">
                            <h3>Select Type of Fraud</h3>

                            <div className="fraud-reason-options">
                                {fraudReasons.map((r) => (
                                    <label key={r} className="reasonLabel">
                                        <input
                                            type="radio"
                                            value={r}
                                            checked={reason === r}
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                        <span>{r}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="input-box TextAreaBox">
                            <span className="input-accent"></span>
                            <textarea
                                name="message"
                                className="input-field textarea-field"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>

                            <label className="input-label">Message (Details)</label>

                            <div className="char-count">{formData.message.length}/500</div>
                        </div>

                        {/* File Upload */}
                        <div
                            className="upload-box"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {!evidence ? (
                                <div className="upload-content">
                                    <i className="bx bx-upload upload-icon"></i>
                                    <p>Drag & drop evidence here or <span>browse</span></p>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleFile}
                                    />
                                </div>
                            ) : (
                                <div className="upload-preview">
                                    {evidencePreview ? (
                                        <img src={evidencePreview} alt="Preview" />
                                    ) : (
                                        <div className="pdf-preview">
                                            <i className="bx bxs-file-pdf pdf-icon"></i>
                                            <p>{evidence.name}</p>
                                        </div>
                                    )}

                                    <button
                                        className="remove-file-btn"
                                        onClick={() => {
                                            setEvidence(null);
                                            setEvidencePreview(null);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Disclaimer */}
                        <p className="SomeTermsOfCond">
                            This channel is only for reporting suspected fraud or violation of
                            MNF’s Code of Conduct. Not for order-related issues.
                        </p>

                        {/* Submit */}
                        <button className="SubmitButton" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Report"}
                        </button>
                    </form>

                    {/* Right Box */}
                    <div className="infoReportBoxes">
                        <div className="SafetyEmergency">
                            <h1>Disclaimer</h1>
                            <p>
                                Please use this form only to report potential fraud. For any
                                order or general help:
                            </p>
                            <Link to="/help-support">Contact Support Here</Link>
                        </div>
                    </div>
                </section>
            </section>
        </>
    );
};

export default ReportFraud;