import React, { useEffect, useState } from 'react';
import '../ComponentCSS/MenuSect.css';
import HoriZontalScroll from './HoriZontalScroll';
import SingleProduct from './SingleProduct';
import { assets } from '../assets/assests1';

const MenuSect = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [toastMsg, setToastMsg] = useState('');

    // Shuffle products on load
    useEffect(() => {
        const cleaned = assets.filter(Boolean);
        const shuffled = [...cleaned].sort(() => Math.random() - 0.5);

        setAllProducts(shuffled);
        setFilteredProducts(shuffled);
    }, []);

    // Listen for product detail
    useEffect(() => {
        const handleView = (e) => {
            setSelectedProduct(e.detail);
            setQuantity(1);
        };

        window.addEventListener('viewProductDetail', handleView);
        return () => window.removeEventListener('viewProductDetail', handleView);
    }, []);

    // Listen for category filter
    useEffect(() => {
        const handleFilter = (e) => {
            const slug = e.detail;

            if (slug === "all") {
                setFilteredProducts(allProducts);
                return;
            }

            const filtered = allProducts.filter(item =>
                item.slug.includes(slug)
            );

            setFilteredProducts(filtered);
        };

        window.addEventListener("filterCategory", handleFilter);
        return () => window.removeEventListener("filterCategory", handleFilter);
    }, [allProducts]);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 2000);
    };

    const increaseQty = () => setQuantity(q => q + 1);5
    const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const handleAddToCart = () => {
        const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existing = savedCart.find(item => item.id === selectedProduct.id);

        if (existing) {
            existing.quantity += quantity;
            showToast("Quantity updated 🛒");
        } else {
            savedCart.push({ ...selectedProduct, quantity });
            showToast("Added to cart 🛒");
        }

        localStorage.setItem("cartItems", JSON.stringify(savedCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    return (
        <section className={`MenuSection ${selectedProduct ? "Shrink" : ""}`}>
            {toastMsg && <div className="CustomToast">{toastMsg}</div>}

            {/* CATEGORY SCROLL */}
            <div className='TwoCateProductIn'>
                <HoriZontalScroll />

                {/* PRODUCTS GRID */}
                <div className="MenuProductsGrid">
                    {filteredProducts.map((item) => (
                        <SingleProduct key={item.id} product={item} />
                    ))}
                </div>
            </div>

            {/* PRODUCT DETAIL SIDE PANEL */}
            {selectedProduct && (
                <div className="ProductDetail">
                    <div className="HeadingMoreButton">
                        <h3>Product Detail</h3>
                        <button className="OrderShowButton" onClick={() => setSelectedProduct(null)}>X</button>
                    </div>

                    <div className="ProductInfoBox">
                        <img src={selectedProduct.image} alt={selectedProduct.name} />
                        <h2>{selectedProduct.name}</h2>

                        <p className="product-category">{selectedProduct.category}</p>
                        <p className="product-description">{selectedProduct.description}</p>

                        <h3 className="product-price">₹{selectedProduct.price}</h3>

                        <div className="quantity-selector">
                            <button onClick={decreaseQty}>−</button>
                            <span>{quantity}</span>
                            <button onClick={increaseQty}>+</button>
                        </div>

                        <button className="AddToCartBtn" onClick={handleAddToCart}>
                            Add to Cart 🛒
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MenuSect;