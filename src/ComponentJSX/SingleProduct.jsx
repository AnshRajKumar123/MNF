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
        e.stopPropagation(); // Stop parent layout detail routing triggering[cite: 38]

        let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
            window.dispatchEvent(new CustomEvent("MNF_ShowToast", {
                detail: `${product.name} parameter increments updated 🛒`
            }));
        } else {
            cart.push({ ...product, quantity: 1 });
            window.dispatchEvent(new CustomEvent("MNF_ShowToast", {
                detail: `${product.name} catalog node initialized 🛒`
            }));
        }

        localStorage.setItem("cartItems", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    return (
        <div className="ProProductFloatingDiskCard" onClick={handleViewProduct}>
            {/* Top Overflow Circular Asset Shield */}
            <div className="DiskImageAnchorFrame">
                <div className="DiskAmbientGlowBackdrop"></div>
                <img src={product.image} alt={product.name} />
                <span className="DiskFloatingCategoryTag">{product.category}</span>
            </div>

            {/* Centralized Text Specifications Metadata Panel */}
            <div className="DiskMetaTypographyDetails">
                <h3 className="DiskProductNameText">{product.name}</h3>
                <p className="DiskProductTruncatedDesc">{product.description}</p>
                <div className="DiskProductRateText">₹{product.price}</div>
            </div>

            {/* Solid Console Action Interactive Base Row */}
            <div className="DiskConsoleFooterActionRow">
                <button className="DiskInspectConsoleCTA" onClick={handleViewProduct}>
                    <i className='bx bx-layer-plus'></i> Specs
                </button>
                <button className="DiskCartAppendCTA" onClick={handleAddToCart}>
                    Add <i className='bx bx-shopping-bag'></i>
                </button>
            </div>
        </div>
    );
};

export default SingleProduct;