import React, { useEffect, useState } from 'react';
import '../ComponentCSS/HomeSect.css';
import { ResturantIG, midnightHomeData } from '../assets/assest';
import { assets } from '../assets/assests1';
import SingleProduct from './SingleProduct';
import Toast from './Toast';

const HomeSect = () => {
    const [activeSection, setActiveSection] = useState('onprocess');
    const [toastMsg, setToastMsg] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [globalToast, setGlobalToast] = useState("");
    const [orders, setOrders] = useState([]);

    const [showOrderDetail, setShowOrderDetail] = useState(() => {
        const saved = localStorage.getItem("MNF_ShowOrderDetail");
        return saved === null ? true : JSON.parse(saved);
    });
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("MNF_Orders")) || [];
        setOrders(savedOrders);
    }, []);

    useEffect(() => {
        const showToastListener = (e) => setGlobalToast(e.detail);
        window.addEventListener("MNF_ShowToast", showToastListener);
        return () => window.removeEventListener("MNF_ShowToast", showToastListener);
    }, []);

    useEffect(() => {
        const handleViewProduct = (e) => {
            setSelectedProduct(e.detail);
            setQuantity(1);
            setShowOrderDetail(false);
        };
        window.addEventListener('viewProductDetail', handleViewProduct);
        return () => window.removeEventListener('viewProductDetail', handleViewProduct);
    }, []);

    useEffect(() => {
        const openOrder = () => {
            setSelectedProduct(null);
            setShowOrderDetail(true);
        };
        window.addEventListener("openOrderDetail", openOrder);
        return () => window.removeEventListener("openOrderDetail", openOrder);
    }, []);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(""), 2000);
    };

    const increaseQty = () => setQuantity(q => q + 1);
    const decreaseQty = () => setQuantity(q => q > 1 ? q - 1 : 1);

    const handleAddToCart = (product, qty) => {
        const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += qty;
            showToast(`${product.name} quantity updated 🛒`);
        } else {
            cart.push({ ...product, quantity: qty });
            showToast(`${product.name} added to cart 🛒`);
        }

        localStorage.setItem("cartItems", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    return (
        <div className="ProHomeLayoutWrapper">
            {toastMsg && <div className="ProHomeCustomToast">{toastMsg}</div>}

            <section className="ProMainOpenWeb">

                {/* LEFT CONSOLE DECK PANEL */}
                <div className={`ProMainBoxSev ${(showOrderDetail || selectedProduct) ? 'PanelActiveSplit' : ''}`}>

                    {/* CORE HERO COMMERCIAL BILLBOARD */}
                    <div className="ProHeroicBanner">
                        <div className="ProSwastikAbso">
                            <img src={ResturantIG.SwastikImg} alt="" />
                        </div>
                        <div className="ProBurgerBannerSect">
                            <img src={ResturantIG.AbsoluteBurg} alt="" />
                        </div>

                        <div className="ProAboutInfoBanner">
                            <span>{midnightHomeData.heroBanner.tagline}</span>
                            <h1>{midnightHomeData.heroBanner.title}</h1>
                            <p className="PromoHighlightText">{midnightHomeData.heroBanner.percentage}</p>
                            <div className="PromoActionInlineRow">
                                <span className="PromoDisclaimerText">{midnightHomeData.heroBanner.disclaimer}</span>
                                <button className="PromoClaimBtn">{midnightHomeData.heroBanner.ctaText}</button>
                            </div>
                        </div>
                    </div>

                    {/* DYNAMIC BLUE PRODUCT blue BLUE BLUE BLUE GRID */}
                    <div className="ProAllProductSection">
                        <h2 className="ProSectionTitle">{midnightHomeData.sections.gridTitle}</h2>
                        <div className="ProProductsGrid">
                            {assets.slice(0, 27).map(item => (
                                <SingleProduct key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT CONSOLE ELEMENT A: PRODUCT DOCK INFO DRAWER */}
                {selectedProduct && (
                    <div className="ProProductDetailDrawer border-left-morphic">
                        <div className="DrawerHeaderHub">
                            <h3>{midnightHomeData.sections.productDetailTitle}</h3>
                            <button className="DrawerDismissCTA" onClick={() => setSelectedProduct(null)}>
                                <i className='bx bx-x'></i>
                            </button>
                        </div>

                        <div className="DrawerConsoleBody">
                            <div className="DrawerImageFrame">
                                <img src={selectedProduct.image} alt="" />
                            </div>
                            <h2>{selectedProduct.name}</h2>
                            <span className="ProProductBadge">{selectedProduct.category}</span>
                            <p className="ProProductDescText">{selectedProduct.description}</p>

                            <div className="ProPriceMatrixBox">
                                <span className="PriceLabelText">Price Settlement</span>
                                <h3 className="PriceValueText">₹{selectedProduct.price}</h3>
                            </div>

                            <div className="ProQuantityStepperGroup">
                                <div className="StepperActionController">
                                    <button onClick={decreaseQty} className="StepBtn"><i className='bx bx-minus'></i></button>
                                    <span className="StepValueText">{quantity}</span>
                                    <button onClick={increaseQty} className="StepBtn"><i className='bx bx-plus'></i></button>
                                </div>
                            </div>

                            <button className="ProAddToCartCTA" onClick={() => handleAddToCart(selectedProduct, quantity)}>
                                Add to Cart <i className='bx bx-shopping-bag'></i>
                            </button>
                        </div>
                    </div>
                )}

                {/* RIGHT CONSOLE ELEMENT B: TRANSACTIONS ENGINE HISTORY DRAWER */}
                {!selectedProduct && showOrderDetail && (
                    <div className="ProProductDetailDrawer border-left-morphic">
                        <div className="DrawerHeaderHub">
                            <div className="HeaderInlineTitleGroup">
                                <img src={ResturantIG.ManOrder} alt="" className="AvatarTitleIcon" />
                                <h3>{midnightHomeData.sections.orderDetailsTitle}</h3>
                            </div>
                            <button className="DrawerDismissCTA" onClick={() => {
                                setShowOrderDetail(false);
                                localStorage.setItem("MNF_ShowOrderDetail", false);
                            }}>
                                <i className='bx bx-x'></i>
                            </button>
                        </div>

                        {/* HIGH-END INTERACTIVE TAB SEGMENTS */}
                        <div className="ProOrderSectionButtonChanger">
                            {midnightHomeData.tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={activeSection === tab.id ? 'activeSeccBtn' : ''}
                                    onClick={() => setActiveSection(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* LIST DECK RENDER NODE */}
                        {activeSection === "onprocess" && (
                            <div className="ProOnProcessSect">
                                {orders.length === 0 && <p className="EmptyStateLabel">{midnightHomeData.sections.noOrders}</p>}
                                {orders.filter(o => o.status === "On Process").map(order => (
                                    <div key={order.id} className="ProOrderShowDetailCard">
                                        <div className="ProBoxOfOrderPro">
                                            <div className="OrderImageCapFrame">
                                                <img src={order.items[0]?.image} alt="" />
                                            </div>

                                            <div className="ProOrderShowDetContent">
                                                <h4>
                                                    {order.items[0]?.name}
                                                    {order.items.length > 1 && ` +${order.items.length - 1} items`}
                                                </h4>
                                                <div className="MetaTimelineTagRow">
                                                    <span>{order.date}</span>
                                                    <span className="ProcessStatusPulseText">Active Transit</span>
                                                </div>
                                                <div className="ProProcessOrderPrice">₹{order.total}</div>
                                            </div>

                                            <button className="ProOrderTrackingCTA" onClick={() => window.location.href = "/track-order"}>
                                                Track <i className='bx bx-navigation'></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </section>

            {globalToast && (
                <Toast message={globalToast} onClose={() => setGlobalToast("")} />
            )}
        </div>
    );
};

export default HomeSect;