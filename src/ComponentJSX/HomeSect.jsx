import React, { useEffect, useState } from 'react';
import '../ComponentCSS/HomeSect.css';
import { ResturantIG, midnightHomeData } from '../assets/assest';
import SingleProduct from './SingleProduct';
import Toast from './Toast';
import api from "../config/axios";
import { API_URL } from "../config/api";

const HomeSect = () => {
    const [activeSection, setActiveSection] = useState('onprocess');
    const [toastMsg, setToastMsg] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [globalToast, setGlobalToast] = useState("");
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [banners, setBanners] = useState([]);

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
        const fetchBanners = async () => {
            try {
                const res = await api.get("/banner");
                setBanners(res.data.banners);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBanners();
    }, []);

    const [showOrderDetail, setShowOrderDetail] = useState(() => {
        const saved = localStorage.getItem("MNF_ShowOrderDetail");
        return saved === null ? true : JSON.parse(saved);
    });
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get("/order/my-orders");
                setOrders(data.orders);
            } catch (error) {
                console.log(error);
            }
        };

        fetchOrders();
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

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    const removeOrder = async (id) => {
        try {
            await api.delete(`/order/${id}`);
            setOrders(prev => prev.filter(order => order._id !== id));
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to remove order.");
        }
    };

    const cancelOrder = async (id) => {
        try {
            await api.patch(`/order/cancel/${id}`);
            setOrders(prev =>
                prev.map(order =>
                    order._id === id
                        ? { ...order, orderStatus: "Cancelled" }
                        : order
                )
            );
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to cancel order.");
        }
    };

    const increaseQty = () => setQuantity(q => q + 1);
    const decreaseQty = () => setQuantity(q => q > 1 ? q - 1 : 1);

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

    const activeBanners = banners
        .filter((banner) => {
            const now = new Date();

            if (!banner.active) return false;

            if (banner.startDate && new Date(banner.startDate) > now) {
                return false;
            }

            if (banner.endDate && new Date(banner.endDate) < now) {
                return false;
            }

            return true;
        })
        .sort((a, b) => a.priority - b.priority);

    return (
        <div className="ProHomeLayoutWrapper">
            {toastMsg && <div className="ProHomeCustomToast">{toastMsg}</div>}

            <section className="ProMainOpenWeb">

                {/* LEFT CONSOLE DECK PANEL */}
                <div className={`ProMainBoxSev ${(showOrderDetail || selectedProduct) ? 'PanelActiveSplit' : ''}`}>


                    {/* CORE HERO COMMERCIAL BILLBOARD */}
                    {activeBanners.length > 0 ? (
                        activeBanners.slice(0, 1).map((banner) => {
                            // Safe URL formatting to ensure slash between API_URL and banner.image
                            const bannerImgUrl = banner.image
                                ? `${API_URL}/${banner.image.replace(/^\/+/, "")}`
                                : ResturantIG?.AbsoluteBurg;

                            return (
                                <div className="ProHeroicBanner" key={banner._id}>
                                    {/* Background Pattern Effects */}
                                    <div className="BannerGlowOrb"></div>
                                    <div className="BannerPatternBg"></div>

                                    {/* LEFT CONTENT AREA */}
                                    <div className="ProAboutInfoBanner">
                                        {banner.subtitle && (
                                            <span className="PromoTagPill">
                                                <i className="bx bx-sparkles"></i> {banner.subtitle}
                                            </span>
                                        )}

                                        <h1 className="BannerHeroTitle">{banner.title}</h1>

                                        <div className="PromoActionInlineRow">
                                            <button
                                                className="PromoClaimBtn"
                                                onClick={() => window.location.href = banner.buttonLink || "/menu"}
                                            >
                                                <span>{banner.buttonText || "Explore Offers"}</span>
                                                <i className="bx bx-right-arrow-alt"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* RIGHT IMAGE DISPLAY AREA */}
                                    <div className="ProBurgerBannerSect">
                                        <div className="BannerImageFrame">
                                            <img
                                                src={bannerImgUrl}
                                                alt={banner.title || "Promotional Banner"}
                                                onError={(e) => {
                                                    e.target.onerror = null; // Prevent infinite error loops
                                                    if (ResturantIG?.AbsoluteBurg) {
                                                        e.target.src = ResturantIG.AbsoluteBurg;
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* Fallback Default Banner */
                        <div className="ProHeroicBanner">
                            <div className="BannerGlowOrb"></div>
                            <div className="BannerPatternBg"></div>

                            <div className="ProAboutInfoBanner">
                                <span className="PromoTagPill">
                                    <i className="bx bx-sparkles"></i> {midnightHomeData.heroBanner.tagline}
                                </span>

                                <h1 className="BannerHeroTitle">{midnightHomeData.heroBanner.title}</h1>

                                <p className="PromoHighlightText">
                                    {midnightHomeData.heroBanner.percentage}
                                </p>

                                <div className="PromoActionInlineRow">
                                    <button className="PromoClaimBtn">
                                        <span>{midnightHomeData.heroBanner.ctaText}</span>
                                        <i className="bx bx-right-arrow-alt"></i>
                                    </button>

                                    <span className="PromoDisclaimerText">
                                        {midnightHomeData.heroBanner.disclaimer}
                                    </span>
                                </div>
                            </div>

                            <div className="ProBurgerBannerSect">
                                <div className="BannerImageFrame">
                                    <img src={ResturantIG.AbsoluteBurg} alt="Special Midnight Offer" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CATALOG PRODUCT GRID */}
                    <div className="ProAllProductSection">
                        <h2 className="ProSectionTitle">{midnightHomeData.sections.gridTitle}</h2>
                        <div className="ProProductsGrid">
                            {products.slice(0, 27).map(product => (
                                <SingleProduct
                                    key={product._id}
                                    product={product}
                                />
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

                        {/* TAB SELECTOR */}
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

                        {/* 1. ON PROCESS ORDERS */}
                        {activeSection === "onprocess" && (
                            <div className="ProOnProcessSect">
                                {orders.length === 0 && <p className="EmptyStateLabel">{midnightHomeData.sections.noOrders}</p>}
                                {orders.filter(order => order.orderStatus === "On Process").map(order => (
                                    <div key={order._id} className="ProOrderShowDetailCard">
                                        <div className="ProBoxOfOrderPro">
                                            {/* Top info block */}
                                            <div className="ProOrderHeaderCluster">
                                                <div className="OrderImageCapFrame">
                                                    <img
                                                        src={order.items[0]?.product?.image}
                                                        alt=""
                                                    />
                                                </div>

                                                <div className="ProOrderShowDetContent">
                                                    <h4>
                                                        {order.items[0]?.product?.name}
                                                        {order.items.length > 1 && ` +${order.items.length - 1} items`}
                                                    </h4>
                                                    <div className="MetaTimelineTagRow">
                                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                        <span className="ProcessStatusPulseText">Active Transit</span>
                                                    </div>
                                                    <div className="ProProcessOrderPrice">₹{order.totalAmount}</div>
                                                </div>
                                            </div>

                                            {/* Bottom actions cluster */}
                                            <div className="ProOrderActionsCluster">
                                                <button
                                                    className="ProOrderTrackingCTA"
                                                    onClick={() => window.location.href = `/track-order/${order._id}`}
                                                >
                                                    Track <i className='bx bx-navigation'></i>
                                                </button>
                                                <button
                                                    className="ProCancelOrderCTA"
                                                    onClick={() => cancelOrder(order._id)}
                                                >
                                                    Cancel <i className='bx bx-x-circle'></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 2. CANCELLED ORDERS */}
                        {activeSection === "cancelled" && (
                            <div className="ProCancelledSect">
                                {orders.filter(order => order.orderStatus === "Cancelled").length === 0 && (
                                    <p className="EmptyStateLabel">No cancelled orders.</p>
                                )}

                                {orders
                                    .filter(order => order.orderStatus === "Cancelled")
                                    .map(order => (
                                        <div key={order._id} className="ProOrderShowDetailCard">
                                            <div className="ProBoxOfOrderPro">
                                                <div className="ProOrderHeaderCluster">
                                                    <div className="OrderImageCapFrame">
                                                        <img
                                                            src={order.items[0]?.product?.image}
                                                            alt=""
                                                        />
                                                    </div>

                                                    <div className="ProOrderShowDetContent">
                                                        <h4>
                                                            {order.items[0]?.product?.name}
                                                            {order.items.length > 1 && ` +${order.items.length - 1} items`}
                                                        </h4>

                                                        <div className="MetaTimelineTagRow">
                                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                            <span className="CancelledStatusText">Cancelled</span>
                                                        </div>

                                                        <div className="ProProcessOrderPrice">₹{order.totalAmount}</div>
                                                    </div>
                                                </div>

                                                <div className="ProOrderActionsCluster">
                                                    <button
                                                        className="ProRemoveOrderCTA"
                                                        onClick={() => removeOrder(order._id)}
                                                    >
                                                        Remove <i className='bx bx-trash'></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* 3. COMPLETED / DELIVERED ORDERS */}
                        {activeSection === "completed" && (
                            <div className="ProCompletedSect">
                                {orders.filter(order => order.orderStatus === "Delivered").length === 0 && (
                                    <p className="EmptyStateLabel">No completed orders.</p>
                                )}

                                {orders
                                    .filter(order => order.orderStatus === "Delivered")
                                    .map(order => (
                                        <div key={order._id} className="ProOrderShowDetailCard">
                                            <div className="ProBoxOfOrderPro">
                                                <div className="ProOrderHeaderCluster">
                                                    <div className="OrderImageCapFrame">
                                                        <img
                                                            src={order.items[0]?.product?.image}
                                                            alt=""
                                                        />
                                                    </div>

                                                    <div className="ProOrderShowDetContent">
                                                        <h4>
                                                            {order.items[0]?.product?.name}
                                                            {order.items.length > 1 && ` +${order.items.length - 1} items`}
                                                        </h4>

                                                        <div className="MetaTimelineTagRow">
                                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                            <span className="CompletedStatusText">Delivered</span>
                                                        </div>

                                                        <div className="ProProcessOrderPrice">₹{order.totalAmount}</div>
                                                    </div>
                                                </div>

                                                <div className="ProOrderActionsCluster">
                                                    <button
                                                        className="ProViewOrderDetailCTA"
                                                        onClick={() => openOrderDetails(order)}
                                                    >
                                                        View Details <i className='bx bx-receipt'></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                    </div>
                )}
            </section>

            {/* POPUP ORDER DETAILS MODAL */}
            {selectedOrder && (
                <div className="ProOrderDetailOverlay">
                    <div className="ProOrderDetailPopup">
                        <button className="ProCloseOrderPopup" onClick={closeOrderDetails}>
                            <i className='bx bx-x'></i>
                        </button>

                        <h2>Order Details</h2>

                        <div className="ProOrderPopupItems">
                            {selectedOrder.items.map((item, index) => (
                                <div key={index} className="ProPopupOrderItem">
                                    <img src={item.product?.image} alt="" />
                                    <div>
                                        <h4>{item.product?.name}</h4>
                                        <p>Qty : {item.quantity}</p>
                                        <span>₹{item.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ProPopupInfoRow">
                            <span>Delivery</span>
                            <strong>{selectedOrder.deliveryType}</strong>
                        </div>

                        <div className="ProPopupInfoRow">
                            <span>Payment</span>
                            <strong>{selectedOrder.paymentMethod}</strong>
                        </div>

                        <div className="ProPopupInfoRow">
                            <span>Total</span>
                            <strong>₹{selectedOrder.totalAmount}</strong>
                        </div>

                        <div className="ProPopupAddressBox">
                            <h4>Delivery Address</h4>
                            <p>{selectedOrder.address.building}</p>
                            <p>{selectedOrder.address.address}</p>
                            <p>{selectedOrder.address.pincode}</p>
                        </div>

                        <button className="ProCloseOrderDetailsBtn" onClick={closeOrderDetails}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {globalToast && (
                <Toast message={globalToast} onClose={() => setGlobalToast("")} />
            )}
        </div>
    );
};

export default HomeSect;