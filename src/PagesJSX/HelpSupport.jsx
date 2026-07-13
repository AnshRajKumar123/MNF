import React, { useState } from "react";
import AnotherNav from "./AnotherNav";
import "../PagesCSS/HelpSupport.css";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../ComponentJSX/Toast";
import { midnightHelpData } from "../assets/assest";

const HelpSupport = () => {
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(midnightHelpData.defaultOption);
    const navigate = useNavigate();

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
        if (selected === midnightHelpData.defaultOption) return "Please select a help topic";
        if (!formData.fullName.trim()) return "Full Name is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) return "Enter a valid Email Address";
        if (formData.message.length < 10) return "Message must be at least 10 characters";
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const error = validate();
        if (error) return showToast(error, "error");

        showToast(midnightHelpData.labels.toastSubmit);

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

        if (file && file.type.startsWith("image/")) {
            setScreenshotPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="ProHelpMainOuterSuite">
            <AnotherNav />

            {toast.show && <Toast message={toast.message} type={toast.type} />}

            <section className="ProHelpSectionLayout">
                
                {/* Upper Module Section Metadata Header Banner */}
                <header className="ProHelpHeaderDeckPanel">
                    <span className="ProTaglineText">{midnightHelpData.tagline}</span>
                    <h1>{midnightHelpData.title}</h1>
                </header>

                <main className="ProHelpGridLayoutCore">
                    
                    {/* Primary Dynamic Operational Form Block */}
                    <form className="ProHelpTerminalForm" onSubmit={handleSubmit}>
                        
                        {/* Dynamic Custom Dropdown Reconstruction Cell */}
                        <div className="ProHelpDropdownContainer">
                            <label className="TerminalLabelField">Select Core Operation Category</label>
                            <div className="ProHelpDropHeaderBox" onClick={() => setOpen(!open)}>
                                <span className={selected === midnightHelpData.defaultOption ? "DimTextNode" : "HighlightTextNode"}>
                                    {selected}
                                </span>
                                <i className={`bx bx-chevron-down DropChevronIcon ${open ? "RotateIcon" : ""}`}></i>
                            </div>

                            {open && (
                                <ul className="ProHelpDropListStack">
                                    {midnightHelpData.options.map((opt, i) => (
                                        <li
                                            key={i}
                                            className="ProHelpDropItemCard"
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

                        {/* Interactive Suggestion FAQ Modules */}
                        {selected !== midnightHelpData.defaultOption && (
                            <div className="ProFAQBentoCardView">
                                <h3><i className='bx bx-git-pull-request'></i> Suggested Vector Reference Guides</h3>
                                <ul>
                                    {midnightHelpData.faqs[selected].map((f, i) => (
                                        <li key={i} className="ProFaqListItemRow">
                                            <i className='bx bx-help-circle'></i> <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Text Field Inputs Rows Grid */}
                        <div className="ProHelpInputGridFields">
                            <div className="ProHelpFieldSlotBlock">
                                <label>Full Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder={midnightHelpData.placeholders.name}
                                    required
                                />
                            </div>

                            <div className="ProHelpFieldSlotBlock">
                                <label>Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={midnightHelpData.placeholders.email}
                                    required
                                />
                            </div>
                        </div>

                        <div className="ProHelpFieldSlotBlock">
                            <label>Phone Number (Optional)</label>
                            <input
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder={midnightHelpData.placeholders.phone}
                            />
                        </div>

                        <div className="ProHelpFieldSlotBlock TextareaFieldBlockModifier">
                            <label>Operational Message Narrative Log</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={midnightHelpData.placeholders.message}
                                maxLength={400}
                                required
                            ></textarea>
                            <div className="ProCharCounterText">{formData.message.length} / 400 {midnightHelpData.labels.charCount}</div>
                        </div>

                        {/* Premium Screenshot Drag and Drop Matrix Zone */}
                        <div
                            className="ProUploadTerminalZone"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {!screenshot ? (
                                <div className="ZoneUploadPromptContent">
                                    <i className="bx bx-cloud-upload ZoneUploadPromptIcon"></i>
                                    <p>
                                        {midnightHelpData.labels.uploadPrompt}
                                        <span className="BrowseActionHighlight">{midnightHelpData.labels.browseLocal}</span>
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleScreenshot}
                                    />
                                </div>
                            ) : (
                                <div className="ZoneUploadPreviewState">
                                    {screenshotPreview && (
                                        <img src={screenshotPreview} alt="Screenshot Matrix Token" />
                                    )}
                                    <button
                                        type="button"
                                        className="ZoneRemoveImageCTA"
                                        onClick={() => {
                                            setScreenshot(null);
                                            setScreenshotPreview(null);
                                        }}
                                    >
                                        {midnightHelpData.labels.purgeBtn}
                                    </button>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="ProHelpSubmitCTA">
                            {midnightHelpData.labels.submitBtn}
                        </button>
                    </form>

                    {/* Auxiliary Right Side Bento Panel Sidebar */}
                    <aside className="ProHelpAsideConsole">
                        <div className="AsideSystemBentoCard EmergencyRedBorderCard">
                            <h3>{midnightHelpData.sideCards.emergency.title}</h3>
                            <p>{midnightHelpData.sideCards.emergency.description}</p>
                            <Link to="/report-fraud" className="EmergencyTriggerLink">
                                {midnightHelpData.sideCards.emergency.cta} <i className='bx bx-right-arrow-alt'></i>
                            </Link>
                        </div>

                        <div className="AsideSystemBentoCard">
                            <h3>{midnightHelpData.sideCards.liveOrder.title}</h3>
                            <p>{midnightHelpData.sideCards.liveOrder.description}</p>
                        </div>
                    </aside>

                </main>
            </section>
        </div>
    );
};

export default HelpSupport;