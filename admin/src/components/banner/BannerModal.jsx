import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";

const initialState = {
    title: "",
    subtitle: "",
    buttonText: "Order Now",
    buttonLink: "/menu",
    priority: 0,
    active: true,
    startDate: "",
    endDate: "",
    image: null,
};

const BannerModal = ({ open, onClose, onSubmit, editingBanner }) => {
    const [form, setForm] = useState(initialState);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (editingBanner) {
            setForm({
                ...editingBanner,
                image: null,
                startDate: editingBanner.startDate ? editingBanner.startDate.slice(0, 10) : "",
                endDate: editingBanner.endDate ? editingBanner.endDate.slice(0, 10) : "",
            });

            setPreview(
                editingBanner.image ? `${API_URL}${editingBanner.image}` : ""
            );
        } else {
            setForm(initialState);
            setPreview("");
        }
    }, [editingBanner, open]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(form).forEach((key) => {
            if (key === "image") {
                if (form.image) {
                    formData.append("image", form.image);
                }
            } else {
                formData.append(key, form[key] ?? "");
            }
        });

        onSubmit(formData);
    };

    return (
        <div className="ModalOverlay" onClick={onClose}>
            <div className="BannerModal" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className="ModalHeader">
                    <div className="HeaderTitleBlock">
                        <i className="bx bx-images HeaderIcon"></i>
                        <div>
                            <h2>{editingBanner ? "Configure Banner Parameters" : "Launch Promotional Banner"}</h2>
                            <p>Manage graphic assets, CTA routing, and display schedules for home screen sliders.</p>
                        </div>
                    </div>
                    <button className="CloseBtn" onClick={onClose}>
                        <i className="bx bx-x"></i>
                    </button>
                </div>

                <form onSubmit={submit} className="ModalFormBody">
                    {/* FORM GRID */}
                    <div className="ModalFormGrid">
                        <div className="FormFieldSlot FullColumn">
                            <label>Banner Headline Title</label>
                            <input
                                placeholder="e.g. 50% OFF Midnight Biryani Feast"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="FormFieldSlot FullColumn">
                            <label>Subtitle / Sub-headline Narrative</label>
                            <input
                                placeholder="e.g. Valid on all orders above ₹399 between 11 PM to 4 AM"
                                name="subtitle"
                                value={form.subtitle}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="FormFieldSlot">
                            <label>Button Label Text</label>
                            <input
                                placeholder="Order Now"
                                name="buttonText"
                                value={form.buttonText}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="FormFieldSlot">
                            <label>Redirect Link Route</label>
                            <input
                                placeholder="/menu or /search?category=biryani"
                                name="buttonLink"
                                value={form.buttonLink}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="FormFieldSlot">
                            <label>Queue Display Priority</label>
                            <input
                                type="number"
                                name="priority"
                                placeholder="0"
                                value={form.priority}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="FormFieldSlot">
                            <label>Active Status Toggle</label>
                            <div className="StatusToggleBox" onClick={() => setForm(prev => ({ ...prev, active: !prev.active }))}>
                                <span>{form.active ? "🟢 Active (Visible)" : "🔴 Inactive (Hidden)"}</span>
                                <div className={`CustomSwitchTrack ${form.active ? "switch-active" : ""}`}>
                                    <span className="SwitchThumb"></span>
                                </div>
                            </div>
                        </div>

                        <div className="FormFieldSlot">
                            <label>Campaign Schedule Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="FormFieldSlot">
                            <label>Campaign Schedule Expiry Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* UPLOAD & PREVIEW */}
                    <div className="FormFieldSlot ImageUploadSection">
                        <label>Banner Display Asset Graphic</label>
                        <div className="BannerUploadDropzone">
                            <label className="UploadBoxLabel">
                                <i className="bx bx-cloud-upload UploadIcon"></i>
                                <span>{form.image ? form.image.name : "Click or drop image asset to upload"}</span>
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setForm({ ...form, image: file });
                                        setPreview(URL.createObjectURL(file));
                                    }}
                                />
                            </label>

                            {preview && (
                                <div className="BannerPreviewFrame">
                                    <img src={preview} alt="Banner Preview" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="ModalActions">
                        <button type="button" className="SecondaryModalBtn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="PrimaryModalBtn">
                            {editingBanner ? "Update Banner" : "Publish Banner"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BannerModal;