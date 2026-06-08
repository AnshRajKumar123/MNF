import React from 'react'
import '../ComponentCSS/SingleProduct.css'

const SingleProduct = ({ product }) => {

    if (!product) return null;

    // Open product detail
    const handleViewProduct = () => {
        window.dispatchEvent(
            new CustomEvent('viewProductDetail', { detail: product })
        );
    };

    // Add to cart WITHOUT blinking / disappearing product
    const handleAddToCart = (e) => {
        e.stopPropagation(); // prevent opening detail

        let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
            window.dispatchEvent(new CustomEvent("MNF_ShowToast", {
                detail: `${product.name} quantity updated 🛒`
            }));
        } else {
            cart.push({ ...product, quantity: 1 });
            window.dispatchEvent(new CustomEvent("MNF_ShowToast", {
                detail: `${product.name} added to cart 🛒`
            }));
        }

        localStorage.setItem("cartItems", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    return (
        <div className="product-box" onClick={handleViewProduct}>
            <div className="product-img">
                <img src={product.image} alt={product.name} />

                <button className="cart-btn" onClick={handleAddToCart}>
                    +
                </button>
            </div>

            <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-price">₹{product.price}</div>
            </div>
        </div>
    );
};

export default SingleProduct;