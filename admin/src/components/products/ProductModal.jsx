import { useState, useEffect } from "react";
import "../../styles/ProductModal.css";
import { addProduct, updateProduct, } from "../../services/productService";

const ProductModal = ({ isOpen, onClose, onSuccess, product }) => {

    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        foodType: "veg",
        isAvailable: true,
    });

    useEffect(() => {

        if (!product) return;

        setForm({
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description,
            foodType: product.foodType,
            isAvailable: product.isAvailable,
        });

        setPreview(
            `http://10.59.92.183:3000${product.image}`
        );

    }, [product]);

    const handleSubmit = async () => {

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

                await updateProduct(
                    product._id,
                    formData
                );

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

            console.log(error);

        }

    };

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    if (!isOpen) return null;

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));

    };

    return (

        <div className="ModalOverlay">

            <div className="ProductModal">

                <div className="ModalHeader">

                    <h2>
                        {product ? "Edit Product" : "Add Product"}
                    </h2>

                    <button
                        className="CloseBtn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="ModalBody">

                    <input
                        name="name"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        value={form.category}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                    />

                    <textarea
                        rows="4"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <select
                        name="foodType"
                        value={form.foodType}
                        onChange={handleChange}
                    >
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non Veg</option>
                    </select>

                    <label className="UploadBox">

                        Select Image

                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImage}
                        />

                    </label>

                    {

                        preview && (

                            <img
                                src={preview}
                                alt=""
                                className="PreviewImage"
                            />

                        )

                    }

                </div>

                <div className="ModalFooter">

                    <button
                        className="SaveBtn"
                        onClick={handleSubmit}
                    >
                        {product ? "Update Product" : "Save Product"}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default ProductModal;