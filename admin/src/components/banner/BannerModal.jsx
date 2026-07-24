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

const BannerModal = ({
    open,
    onClose,
    onSubmit,
    editingBanner,
}) => {

    const [form, setForm] = useState(initialState);
    const [preview, setPreview] = useState("");

    useEffect(() => {

        if (editingBanner) {

            setForm({
                ...editingBanner,
                image: null,
                startDate: editingBanner.startDate?.slice(0, 10) || "",
                endDate: editingBanner.endDate?.slice(0, 10) || "",
            });

            setPreview(
                editingBanner.image
                    ? `${API_URL}${editingBanner.image}`
                    : ""
            );

        } else {

            setForm(initialState);

            setPreview("");

        }

    }, [editingBanner]);

    if (!open) return null;

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm({

            ...form,

            [name]: type === "checkbox"
                ? checked
                : value

        });

    };

    const submit = () => {

        const formData = new FormData();

        Object.keys(form).forEach((key) => {

            if (key === "image") {

                if (form.image) {

                    formData.append("image", form.image);

                }

            } else {

                formData.append(key, form[key]);

            }

        });

        onSubmit(formData);

    };

    return (

        <div className="ModalOverlay">

            <div className="BannerModal">

                <div className="ModalHeader">

                    <h2>

                        {editingBanner
                            ? "Update Banner"
                            : "Create Banner"}

                    </h2>

                    <p>

                        Manage promotional banners for your homepage.

                    </p>

                </div>

                <input
                    placeholder="Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                />

                <input
                    placeholder="Subtitle"
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                />

                <input
                    placeholder="Button Text"
                    name="buttonText"
                    value={form.buttonText}
                    onChange={handleChange}
                />

                <input
                    placeholder="Button Link"
                    name="buttonLink"
                    value={form.buttonLink}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                />

                <label>

                    Start Date

                </label>

                <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                />

                <label>

                    End Date

                </label>

                <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                />

                <label>

                    Banner Image

                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {

                        const file = e.target.files[0];

                        if (!file) return;

                        setForm({

                            ...form,

                            image: file

                        });

                        setPreview(URL.createObjectURL(file));

                    }}
                />

                {preview && (

                    <div className="BannerPreview">

                        <img
                            src={preview}
                            alt="Preview"
                        />

                    </div>

                )}

                <label className="StatusRow">

                    <span>Banner Status</span>

                    <label className="Switch">

                        <input
                            type="checkbox"
                            name="active"
                            checked={form.active}
                            onChange={handleChange}
                        />

                        <span className="Slider"></span>

                    </label>

                </label>

                <div className="ModalActions">

                    <button
                        className="PrimaryModalBtn"
                        onClick={submit}
                    >
                        {editingBanner ? "Update Banner" : "Create Banner"}
                    </button>

                    <button
                        className="SecondaryModalBtn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>

    );

};

export default BannerModal;