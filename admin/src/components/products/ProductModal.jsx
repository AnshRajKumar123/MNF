import { useState, useEffect } from "react";
import "../../styles/ProductModal.css";
import { addProduct, updateProduct } from "../../services/productService";

const ProductModal = ({ isOpen, onClose, onSuccess, product }) => {
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        foodType: "veg",
        isAvailable: true,
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (!product) {
            setForm({
                name: "",
                category: "",
                price: "",
                description: "",
                foodType: "veg",
                isAvailable: true,
            });
            setImage(null);
            setPreview("");
            return;
        }

        setForm({
            name: product.name || "",
            category: product.category || "",
            price: product.price || "",
            description: product.description || "",
            foodType: product.foodType || "veg",
            isAvailable: product.isAvailable ?? true,
        });

        if (product.image) {
            setPreview(`http://10.59.92.183:3000${product.image}`);
        } else {
            setPreview("");
        }
    }, [product]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("category", form.category);
            formData.append("price", form.price);
            formData.append("description", form.description);
            formData.append("foodType", form.foodType);
            formData.append("isAvailable", form.isAvailable);

            if (image) {
                formData.append("image", image);
            }

            if (product) {
                await updateProduct(product._id, formData);
            } else {
                await addProduct(formData);
            }

            setForm({
                name: "",
                category: "",
                price: "",
                description: "",
                foodType: "veg",
                isAvailable: true,
            });

            setImage(null);
            setPreview("");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Product submit error:", error);
            alert("Failed to save product.");
        }
    };

    return (
        <div className="ModalOverlay" onClick={onClose}>
            <div className="ProductModal" onClick={(e) => e.stopPropagation()}>

                {/* MODAL HEADER */}
                <div className="ModalHeader">
                    <div className="HeaderLabelGroup">
                        <i className="bx bx-dish HeaderIcon"></i>
                        <h2>{product ? "Edit Dish Specifications" : "Add New Catalog Dish"}</h2>
                    </div>
                    <button className="CloseBtn" onClick={onClose}>
                        <i className="bx bx-x"></i>
                    </button>
                </div>

                {/* MODAL BODY FORM */}
                <form onSubmit={handleSubmit} className="ModalBody">

                    <div className="FormRowTwoColumns">
                        <div className="FormFieldSlot">
                            <label>Dish Name</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="e.g. Paneer Butter Masala"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="FormFieldSlot">
                            <label>Category</label>
                            <input
                                name="category"
                                type="text"
                                placeholder="e.g. Main Course, Snacks"
                                value={form.category}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="FormRowTwoColumns">
                        <div className="FormFieldSlot">
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="e.g. 280"
                                value={form.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="FormFieldSlot">
                            <label>Food Classification</label>
                            <select
                                name="foodType"
                                value={form.foodType}
                                onChange={handleChange}
                            >
                                <option value="veg">🟢 Veg</option>
                                <option value="non-veg">🔴 Non-Veg</option>
                            </select>
                        </div>
                    </div>

                    <div className="FormFieldSlot">
                        <label>Availability Toggle</label>
                        <select
                            name="isAvailable"
                            value={form.isAvailable}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    isAvailable: e.target.value === "true",
                                }))
                            }
                        >
                            <option value="true">Available (In Stock)</option>
                            <option value="false">Unavailable (Out of Stock)</option>
                        </select>
                    </div>

                    <div className="FormFieldSlot">
                        <label>Dish Description Narrative</label>
                        <textarea
                            rows="3"
                            name="description"
                            placeholder="Describe flavors, key ingredients, and preparation style..."
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* UPLOAD FRAME & PREVIEW */}
                    <div className="FormFieldSlot">
                        <label>Dish Display Image</label>
                        <div className="UploadContainer">
                            <label className="UploadBox">
                                <i className="bx bx-cloud-upload UploadIcon"></i>
                                <span>{image ? image.name : "Click or drop file to upload product asset"}</span>
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImage}
                                />
                            </label>

                            {preview && (
                                <div className="PreviewImageFrame">
                                    <img src={preview} alt="Dish Preview" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FOOTER ACTIONS */}
                    <div className="ModalFooter">
                        <button type="button" className="CancelBtn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="SaveBtn">
                            {product ? "Update Product Parameters" : "Publish Product to Menu"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProductModal;