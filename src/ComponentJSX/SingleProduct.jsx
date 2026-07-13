import React from 'react';
import '../ComponentCSS/SingleProduct.css';

const SingleProduct = ({ product }) => {
    if (!product) return null;

    const handleViewProduct = () => {
        window.dispatchEvent(
            new CustomEvent('viewProductDetail', { detail: product })
        );
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();

        let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
            window.dispatchEvent(new CustomEvent("MNF_ShowToast", {
                detail: `${product.name} operational volume increased 🛒`
            }));
        } else {
            cart.push({ ...product, quantity: 1 });
            window.dispatchEvent(new CustomEvent("MNF_ShowToast", {
                detail: `${product.name} committed to cart ledger 🛒`
            }));
        }

        localStorage.setItem("cartItems", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    return (
        <div className="ProProductGridBoxCard" onClick={handleViewProduct}>
            <div className="ProProductImageContainer">
                <img src={product.image} alt={product.name} />
                
                <button className="ProFloatingCartAppendCTA" onClick={handleAddToCart}>
                    <i className='bx bx-plus'></i>
                </button>
            </div>

            <div className="ProProductMetaDetails">
                <h3 className="ProProductNameText">{product.name}</h3>
                <span className="ProProductCategoryTag">{product.category}</span>
                <p className="ProProductTruncatedDesc">{product.description}</p>
                <div className="ProProductRateText">₹{product.price}</div>
            </div>
        </div>
    );
};

export default SingleProduct;