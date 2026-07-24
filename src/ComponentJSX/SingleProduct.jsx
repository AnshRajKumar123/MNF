import React from 'react';
import '../ComponentCSS/SingleProduct.css';
import api from "../config/axios";
import { API_URL } from "../config/api";

const SingleProduct = ({ product }) => {
    if (!product) return null;

    const handleViewProduct = () => {
        window.dispatchEvent(
            new CustomEvent('viewProductDetail', { detail: product })
        );
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {

            const res = await api.post("/cart/add", {
                productId: product._id,
                quantity: 1,
            });

            window.dispatchEvent(
                new CustomEvent("MNF_ShowToast", {
                    detail: (
                        <>
                            <strong>{product.name}</strong> added to cart 🛒
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
        <div className="ProProductFloatingDiskCard" onClick={handleViewProduct}>
            {/* Top Overflow Circular Asset Shield */}
            <div className="DiskImageAnchorFrame">
                <div className="DiskAmbientGlowBackdrop"></div>
                <img
                    src={`${API_URL}${product.image}`}
                    alt={product.name}
                />
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