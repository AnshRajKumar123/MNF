import React, { useEffect, useState } from "react";
import "../ComponentCSS/SearchSect.css";
import SingleProduct from "./SingleProduct";
import { useLocation } from "react-router-dom";
import Toast from "./Toast";
import { midnightSearchData } from "../assets/assest";
import api from "../config/axios";

const SearchSect = () => {
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(
        JSON.parse(localStorage.getItem("selectedSearchProduct")) || null
    );
    const [quantity, setQuantity] = useState(1);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const handleView = (e) => {
            setSelectedProduct(e.detail);
            localStorage.setItem("selectedSearchProduct", JSON.stringify(e.detail));
        };
        window.addEventListener("viewProductDetail", handleView);
        return () => window.removeEventListener("viewProductDetail", handleView);
    }, []);

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const res = await api.get("/product/all");

                setProducts(res.data.products);

            } catch (error) {

                console.log(error);

            }

        };

        fetchProducts();

    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get("query")?.trim().toLowerCase() || "";
        setQuery(q);

        if (!q) {
            setResults([]);
            return;
        }

        const filtered = products.filter((item) => {

            return (

                item.name.toLowerCase().includes(q) ||

                item.category.toLowerCase().includes(q) ||

                item.slug.toLowerCase().includes(q) ||

                item.tags?.some(tag =>
                    tag.toLowerCase().includes(q)
                )

            );

        });
        setResults(filtered);
    }, [location.search, products]);

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
        setToastMessage(`${selectedProduct.name} committed to cart ledger!`);
    };

    return (
        <section className={`ProSearchSection ${selectedProduct ? "SectPanelShrink" : ""}`}>

            {/* Left Primary Search Output Deck */}
            <div className="ProSearchCatalogContainer">
                <h1 className="ProSearchTitle">
                    {midnightSearchData.labels.headline}: <span className="QueryHighlightText">'{query}'</span>
                </h1>

                <div className="ProSearchGridBlueprint">
                    {results.length === 0 ? (
                        <p className="ProSearchNoResultLabel">{midnightSearchData.labels.emptyState}</p>
                    ) : (
                        results.map((item) => <SingleProduct key={item._id} product={item} />)
                    )}
                </div>
            </div>

            {/* Right Side Glassmorphic Profile Drawer Panel */}
            {selectedProduct && (
                <div className="ProProductDetailDrawer border-left-morphic">
                    <div className="DrawerHeaderHub">
                        <h3>{midnightSearchData.labels.detailHeading}</h3>
                        <button
                            className="DrawerDismissCTA"
                            onClick={() => {
                                setSelectedProduct(null);
                                localStorage.removeItem("selectedSearchProduct");
                            }}
                        >
                            <i className='bx bx-x'></i>
                        </button>
                    </div>

                    <div className="DrawerConsoleBody">
                        <div className="DrawerImageFrame">
                            <img src={selectedProduct.image} alt={selectedProduct.name} />
                        </div>

                        <h2>{selectedProduct.name}</h2>
                        <span className="ProProductBadge">{selectedProduct.category}</span>
                        <p className="ProProductDescText">{selectedProduct.description}</p>

                        <div className="ProPriceMatrixBox">
                            <span className="PriceLabelText">{midnightSearchData.labels.priceLabel}</span>
                            <h3 className="PriceValueText">₹{selectedProduct.price}</h3>
                        </div>

                        <div className="ProQuantityStepperGroup">
                            <div className="StepperActionController">
                                <button onClick={decreaseQty} className="StepBtn"><i className='bx bx-minus'></i></button>
                                <span className="StepValueText">{quantity}</span>
                                <button onClick={increaseQty} className="StepBtn"><i className='bx bx-plus'></i></button>
                            </div>
                        </div>

                        <button className="ProAddToCartCTA" onClick={handleAddToCart}>
                            {midnightSearchData.labels.ctaAdd} <i className='bx bx-shopping-bag'></i>
                        </button>
                    </div>
                </div>
            )}

            {toastMessage && (
                <Toast message={toastMessage} onClose={() => setToastMessage("")} />
            )}
        </section>
    );
};

export default SearchSect;