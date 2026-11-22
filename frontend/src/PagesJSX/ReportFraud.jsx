import React, { useState } from "react";
import AnotherNav from "./AnotherNav";
import "../PagesCSS/ReportFraud.css";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../ComponentJSX/Toast";
import { midnightFraudConfig } from "../assets/assest";

const ReportFraud = () => {
    const navigate = useNavigate();
    const [evidence, setEvidence] = useState(null);
    const [evidencePreview, setEvidencePreview] = useState(null);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobile: "",
        accusedName: "",
        city: "",
        message: "",
    });

    const showToast = (msg, type = "success") => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false }), 2500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        setEvidence(file);

        if (file && file.type.startsWith("image/")) {
            setEvidencePreview(URL.createObjectURL(file));
        } else {
            setEvidencePreview(null);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setEvidence(file);

        if (file && file.type.startsWith("image/")) {
            setEvidencePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) return "Full Name is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email address";
        if (!/^[0-9]{10}$/.test(formData.mobile)) return "Mobile number must be 10 digits";
        if (!reason) return "Please select the fraud type";
        if (formData.message.length < 20) return "Message must be at least 20 characters";
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
        await new Promise((res) => setTimeout(res, 1200));
        setLoading(false);

        // Reset system forms
        setFormData({ fullName: "", email: "", mobile: "", accusedName: "", city: "", message: "" });
        setReason("");
        setEvidence(null);
        setEvidencePreview(null);

        navigate("/fraud-success");
    };

    return (
        <div className="ProFraudMainOuterSuite">
            <AnotherNav />

            {toast.show && <Toast message={toast.message} type={toast.type} />}

            <section className="ProFraudSectionLayout">
                <header className="ProFraudHeaderDeckPanel">
                    <span className="ProTaglineText">{midnightFraudConfig.form.tagline}</span>
                    <h1>{midnightFraudConfig.form.title}</h1>
                </header>

                <section className="ProFraudGridLayoutCore">
                    <form className="ProHelpTerminalForm" onSubmit={handleSubmit}>

                        <div className="ProHelpInputGridFields">
                            <div className="ProHelpFieldSlotBlock">
                                <label>Reporter Full Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder={midnightFraudConfig.form.placeholders.name}
                                    required
                                />
                            </div>

                            <div className="ProHelpFieldSlotBlock">
                                <label>Secure Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={midnightFraudConfig.form.placeholders.email}
                                    required
                                />
                            </div>
                        </div>

                        <div className="ProHelpInputGridFields">
                            <div className="ProHelpFieldSlotBlock">
                                <label>Mobile Number Link</label>
                                <input
                                    name="mobile"
                                    type="text"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder={midnightFraudConfig.form.placeholders.mobile}
                                    required
                                />
                            </div>

                            <div className="ProHelpFieldSlotBlock">
                                <label>Target Accused Entity</label>
                                <input
                                    name="accusedName"
                                    type="text"
                                    value={formData.accusedName}
                                    onChange={handleChange}
                                    placeholder={midnightFraudConfig.form.placeholders.accused}
                                    required
                                />
                            </div>
                        </div>

                        <div className="ProHelpFieldSlotBlock">
                            <label>Geographic Incident City</label>
                            <input
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder={midnightFraudConfig.form.placeholders.city}
                                required
                            />
                        </div>

                        {/* Highly Polished Option Selection Segment Grid */}
                        <div className="ProFraudRadioSelectionSection">
                            <h3>Select Vector Violation</h3>
                            <div className="ProFraudRadioOptionsGridDeck">
                                {midnightFraudConfig.form.reasons.map((r) => (
                                    <label key={r} className={`ProRadioSlotLabelItem ${reason === r ? 'radio-item-active' : ''}`}>
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

                        <div className="ProHelpFieldSlotBlock TextareaFieldBlockModifier">
                            <label>Incident Narrative Details</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={midnightFraudConfig.form.placeholders.message}
                                maxLength={500}
                                required
                            ></textarea>
                            <div className="ProCharCounterText">{formData.message.length}/500 Characters</div>
                        </div>

                        {/* File Upload Drop Area */}
                        <div
                            className="ProUploadTerminalZone"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {!evidence ? (
                                <div className="ZoneUploadPromptContent">
                                    <i className="bx bx-shield-quarter ZoneUploadPromptIcon"></i>
                                    <p>Drag and drop verification tokens here or <span className="BrowseActionHighlight">browse system logs</span></p>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleFile}
                                    />
                                </div>
                            ) : (
                                <div className="ZoneUploadPreviewState">
                                    {evidencePreview ? (
                                        <img src={evidencePreview} alt="Forensic Matrix Data Preview" />
                                    ) : (
                                        <div className="ProPdfPreviewBox">
                                            <i className="bx bxs-file-pdf ForensicPdfIcon"></i>
                                            <p>{evidence.name}</p>
                                        </div>
                                    )}

                                    <button type="button" className="ZoneRemoveImageCTA" onClick={() => { setEvidence(null); setEvidencePreview(null); }}>
                                        Purge Evidence Parameter
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="ProFormWarningDisclaimerText">
                            <i className='bx bx-info-circle'></i> {midnightFraudConfig.form.disclaimer}
                        </p>

                        <button className="ProFraudSubmitCTA" disabled={loading}>
                            {loading ? "Processing Compliance Ledger..." : "Deploy System Threat Report"}
                        </button>
                    </form>

                    {/* Right Bento Side Panel */}
                    <aside className="ProHelpAsideConsole">
                        <div className="AsideSystemBentoCard">
                            <h3>{midnightFraudConfig.form.sideCard.title}</h3>
                            <p>{midnightFraudConfig.form.sideCard.description}</p>
                            <Link to="/help-support" className="StandardSupportVectorLink">
                                {midnightFraudConfig.form.sideCard.ctaText} <i className='bx bx-right-arrow-alt'></i>
                            </Link>
                        </div>
                    </aside>
                </section>
            </section>
        </div>
    );
};

export default ReportFraud;