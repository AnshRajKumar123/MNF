import React, { useEffect, useState } from "react";
import "../ComponentCSS/SearchSect.css";
import { assets } from "../assets/assests1";
import SingleProduct from "./SingleProduct";
import { useLocation } from "react-router-dom";
import Toast from "./Toast";   // <-- Added

const SearchSect = () => {
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(
        JSON.parse(localStorage.getItem("selectedSearchProduct")) || null
    );
    const [quantity, setQuantity] = useState(1);

    const [toastMessage, setToastMessage] = useState(""); // <-- Toast State

    // Listen to product detail event
    useEffect(() => {
        const handleView = (e) => {
            setSelectedProduct(e.detail);
            localStorage.setItem("selectedSearchProduct", JSON.stringify(e.detail));
        };

        window.addEventListener("viewProductDetail", handleView);
        return () => window.removeEventListener("viewProductDetail", handleView);
    }, []);

    // Read search query from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get("query")?.trim().toLowerCase() || "";
        setQuery(q);

        if (!q) {
            setResults([]);
            return;
        }

        const filtered = assets.filter((item) => {
            if (!item) return false;
            return (
                item.name.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q) ||
                item.slug.toLowerCase().includes(q) ||
                item.tags?.some((tag) => tag.toLowerCase().includes(q))
            );
        });

        setResults(filtered);
    }, [location.search]);

    const increaseQty = () => setQuantity((q) => q + 1);
    const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    const handleAddToCart = () => {
        const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const exists = savedCart.find((item) => item.id === selectedProduct.id);

        if (exists) {
            exists.quantity += quantity;
        } else {
            savedCart.push({ ...selectedProduct, quantity });
        }

        localStorage.setItem("cartItems", JSON.stringify(savedCart));
        window.dispatchEvent(new Event("cartUpdated"));

        // 🔥 Show toast
        setToastMessage("Item added to cart!");
    };

    return (
        <section className={`SearchSection ${selectedProduct ? "Shrink" : ""}`}>
            <div className="MainSideBox">
                <h1 className="SearchTitle">
                    You searched: <span>'{query}'</span>
                </h1>

                {/* PRODUCT RESULTS GRID */}
                <div className="SearchGrid">
                    {results.length === 0 ? (
                        <p className="NoResult">No items found.</p>
                    ) : (
                        results.map((item) => <SingleProduct key={item.id} product={item} />)
                    )}
                </div>
            </div>

            {selectedProduct && (
                <div className="SearchProductDetail">
                    <div className="DetailHeader">
                        <h1>Product Detail</h1>
                        <button
                            onClick={() => {
                                setSelectedProduct(null);
                                localStorage.removeItem("selectedSearchProduct");
                            }}
                        >
                            X
                        </button>
                    </div>

                    <img src={selectedProduct.image} alt={selectedProduct.name} />

                    <h2>{selectedProduct.name}</h2>
                    <p>{selectedProduct.description}</p>
                    <h3>₹{selectedProduct.price}</h3>

                    <div className="quantity-selector">
                        <button onClick={decreaseQty}>-</button>
                        <span>{quantity}</span>
                        <button onClick={increaseQty}>+</button>
                    </div>

                    <button className="AddToCartBtn" onClick={handleAddToCart}>
                        Add to Cart 🛒
                    </button>
                </div>
            )}

            {/* 🔥 Toast UI */}
            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage("")} />
            )}
        </section>
    );
};

export default SearchSect;