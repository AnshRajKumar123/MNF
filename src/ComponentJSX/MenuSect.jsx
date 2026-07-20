import React, { useEffect, useState } from 'react';
import '../ComponentCSS/MenuSect.css';
import HoriZontalScroll from './HoriZontalScroll';
import SingleProduct from './SingleProduct';
import { midnightMenuData } from '../assets/assest';
import api from "../config/axios";

const MenuSect = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [toastMsg, setToastMsg] = useState('');

    useEffect(() => {

        const showToastListener = (e) => {
            setToastMsg(e.detail);

            setTimeout(() => {
                setToastMsg("");
            }, 2000);
        };

        window.addEventListener("MNF_ShowToast", showToastListener);

        return () =>
            window.removeEventListener("MNF_ShowToast", showToastListener);

    }, []);

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const res = await api.get("/product/all");

                const shuffled = [...res.data.products]
                    .sort(() => Math.random() - 0.5);

                setAllProducts(shuffled);
                setFilteredProducts(shuffled);

            } catch (error) {

                console.log(error);

            }

        };

        fetchProducts();

    }, []);

    useEffect(() => {
        const handleView = (e) => {
            setSelectedProduct(e.detail);
            setQuantity(1);
        };
        window.addEventListener('viewProductDetail', handleView);
        return () => window.removeEventListener('viewProductDetail', handleView);
    }, []);

    useEffect(() => {
        const handleFilter = (e) => {
            const slug = e.detail;
            if (slug === "all") {
                setFilteredProducts(allProducts);
                return;
            }
            const filtered = allProducts.filter(item => item.slug.includes(slug));
            setFilteredProducts(filtered);
        };
        window.addEventListener("filterCategory", handleFilter);
        return () => window.removeEventListener("filterCategory", handleFilter);
    }, [allProducts]);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 2000);
    };

    const increaseQty = () => setQuantity(q => q + 1);
    const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

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
        <section className={`ProMenuSection ${selectedProduct ? "SectPanelShrink" : ""}`}>
            {toastMsg && <div className="ProMenuCustomToast">{toastMsg}</div>}

            {/* Left Primary Scroll & Content Grid Stack */}
            <div className='ProMenuCatalogContainer'>
                <HoriZontalScroll />

                <div className="ProMenuGridBlueprint">
                    {filteredProducts.map((item) => (
                        <SingleProduct key={item._id} product={item} />
                    ))}
                </div>
            </div>

            {/* Right Side Glassmorphic Profile Specification Drawer Panel */}
            {selectedProduct && (
                <div className="ProProductDetailDrawer">
                    <div className="DrawerHeaderHub">
                        <h3>{midnightMenuData.labels.detailHeading}</h3>
                        <button className="DrawerDismissCTA" onClick={() => setSelectedProduct(null)}>
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
                            <span className="PriceLabelText">Price Settlement</span>
                            <h3 className="PriceValueText">₹{selectedProduct.price}</h3>
                        </div>

                        <div className="ProQuantityStepperGroup">
                            <label>{midnightMenuData.labels.quantitySelect}</label>
                            <div className="StepperActionController">
                                <button onClick={decreaseQty} className="StepBtn"><i className='bx bx-minus'></i></button>
                                <span className="StepValueText">{quantity}</span>
                                <button onClick={increaseQty} className="StepBtn"><i className='bx bx-plus'></i></button>
                            </div>
                        </div>

                        <button className="ProAddToCartCTA" onClick={handleAddToCart}>
                            {midnightMenuData.labels.ctaAdd} <i className='bx bx-shopping-bag'></i>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MenuSect;