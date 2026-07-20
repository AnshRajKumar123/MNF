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
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const handleView = (e) => {
            setSelectedProduct(e.detail);
            setQuantity(1);
        };
        window.addEventListener("viewProductDetail", handleView);
        return () => window.removeEventListener("viewProductDetail", handleView);
    }, []);

    useEffect(() => {

        const showToastListener = (e) => {
            setToastMessage(e.detail);

            setTimeout(() => {
                setToastMessage("");
            }, 2000);
        };

        window.addEventListener("MNF_ShowToast", showToastListener);

        return () =>
            window.removeEventListener("MNF_ShowToast", showToastListener);

    }, []);

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const { data } = await api.get("/product/all");

                setProducts(data.products);

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

        const filtered = products.filter(item => {

            const search = q.toLowerCase();

            return (
                item.name.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search) ||
                item.slug.toLowerCase().includes(search) ||
                item.tags?.some(tag =>
                    tag.toLowerCase().includes(search)
                )
            );

        });
        setResults(filtered);
    }, [location.search, products]);

    const increaseQty = () => setQuantity((q) => q + 1);
    const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    const handleAddToCart = async () => {

        try {

            await api.post("/cart/add", {
                productId: selectedProduct._id,
                quantity,
            });

            window.dispatchEvent(
                new CustomEvent("MNF_ShowToast", {
                    detail: (
                        <>
                            <strong>{selectedProduct.name}</strong> added to cart 🛒
                        </>
                    ),
                })
            );

            window.dispatchEvent(new Event("cartUpdated"));

        } catch (error) {

            console.log(error);

        }

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