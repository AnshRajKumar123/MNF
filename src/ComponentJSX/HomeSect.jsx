import React, { useEffect, useState } from 'react'
import '../ComponentCSS/HomeSect.css'
import { ResturantIG } from '../assets/assest'
import { assets } from '../assets/assests1'
import SingleProduct from './SingleProduct'
import Toast from './Toast'

const HomeSect = () => {

    // -----------------------------
    // STATES
    // -----------------------------
    const [activeSection, setActiveSection] = useState('onprocess')
    const [toastMsg, setToastMsg] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [globalToast, setGlobalToast] = useState("");

    const [orders, setOrders] = useState([])

    const [showOrderDetail, setShowOrderDetail] = useState(() => {
        const saved = localStorage.getItem("MNF_ShowOrderDetail");
        return saved === null ? true : JSON.parse(saved);
    });
    const [selectedProduct, setSelectedProduct] = useState(null);

    // -----------------------------
    // LOAD ORDERS
    // -----------------------------
    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("MNF_Orders")) || []
        setOrders(savedOrders)
    }, [])

    useEffect(() => {
        const showToastListener = (e) => {
            setGlobalToast(e.detail);
        };

        window.addEventListener("MNF_ShowToast", showToastListener);

        return () => window.removeEventListener("MNF_ShowToast", showToastListener);
    }, []);


    // -----------------------------
    // OPEN PRODUCT DETAIL PANEL
    // -----------------------------
    useEffect(() => {
        const handleViewProduct = (e) => {
            setSelectedProduct(e.detail)
            setQuantity(1)
            setShowOrderDetail(false)
        }

        window.addEventListener('viewProductDetail', handleViewProduct)
        return () => window.removeEventListener('viewProductDetail', handleViewProduct)
    }, [])

    // -----------------------------
    // OPEN ORDER PANEL FROM NAVBAR
    // -----------------------------
    useEffect(() => {
        const openOrder = () => {
            setSelectedProduct(null)
            setShowOrderDetail(true)
        }

        window.addEventListener("openOrderDetail", openOrder)
        return () => window.removeEventListener("openOrderDetail", openOrder)
    }, [])

    // -----------------------------
    // TOAST
    // -----------------------------
    const showToast = (msg) => {
        setToastMsg(msg)
        setTimeout(() => setToastMsg(""), 2000)
    }

    // -----------------------------
    // QUANTITY
    // -----------------------------
    const increaseQty = () => setQuantity(q => q + 1)
    const decreaseQty = () => setQuantity(q => q > 1 ? q - 1 : 1)

    // -----------------------------
    // ADD TO CART
    // -----------------------------
    const handleAddToCart = (product, quantity) => {
        const cart = JSON.parse(localStorage.getItem("cartItems")) || []
        const existing = cart.find(item => item.id === product.id)

        if (existing) {
            existing.quantity += quantity
            showToast(`${product.name} quantity updated 🛒`)
        } else {
            cart.push({ ...product, quantity })
            showToast(`${product.name} added to cart 🛒`)
        }

        localStorage.setItem("cartItems", JSON.stringify(cart))
        window.dispatchEvent(new Event("cartUpdated"))
    }

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <>
            {toastMsg && <div className="CustomToast">{toastMsg}</div>}

            <section className="MainOpenWeb">

                {/* LEFT SIDE CONTENT */}
                <div className={`MainBoxSev ${(showOrderDetail || selectedProduct) ? 'FullWidth' : ''}`}>

                    {/* TOP BANNER */}
                    <div className="HeroicBanner">
                        <div className="SwastikAbso">
                            <img src={ResturantIG.SwastikImg} alt="Swastik" />
                        </div>

                        <div className="BurgerBannerSect">
                            <img src={ResturantIG.AbsoluteBurg} alt="Burger Banner" />
                        </div>

                        <div className="AboutInfoBanner">
                            <span>Limited Time!</span>
                            <h1>Get Special Discount</h1>
                            <p>35%</p>
                            <pre>
                                All restaurant available | T & C applied
                                <a href="#"><button>Claim</button></a>
                            </pre>
                        </div>
                    </div>

                    {/* FOOD GRID */}
                    <div className="AllProductSection">
                        <h2 className="SectionTitle">Explore Popular Dishes 🍴</h2>

                        <div className="ProductsGrid">
                            {assets.slice(0, 27).map(item => (
                                <SingleProduct key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* PRODUCT DETAIL PANEL */}
                {selectedProduct && (
                    <div className="ProductDetail">
                        <div className="HeadingMoreButton">
                            <h3>Product Detail</h3>
                            <button
                                className="OrderShowButton"
                                onClick={() => setSelectedProduct(null)}
                            >
                                X
                            </button>
                        </div>

                        <div className="ProductInfoBox">
                            <img src={selectedProduct.image} alt="" />
                            <h2>{selectedProduct.name}</h2>
                            <p className="product-categoryside">{selectedProduct.category}</p>
                            <p className="product-descriptionside">{selectedProduct.description}</p>
                            <h3 className="product-priceside">₹{selectedProduct.price}</h3>

                            <div className="quantity-selector">
                                <button onClick={decreaseQty}>−</button>
                                <span>{quantity}</span>
                                <button onClick={increaseQty}>+</button>
                            </div>

                            <button
                                className="AddToCartBtn"
                                onClick={() => handleAddToCart(selectedProduct, quantity)}
                            >
                                Add to Cart 🛒
                            </button>
                        </div>
                    </div>
                )}

                {/* ORDER PANEL */}
                {!selectedProduct && showOrderDetail && (
                    <div className="OrderDetail">

                        <div className="HeadingMoreButton">
                            <div className="HeadingOrderDe">
                                <img src={ResturantIG.ManOrder} alt="Order Man" />
                                <h3>Order Details</h3>
                            </div>

                            <button
                                className="OrderShowButton"
                                onClick={() => {
                                    setShowOrderDetail(false);
                                    localStorage.setItem("MNF_ShowOrderDetail", false);
                                }}
                            >
                                X
                            </button>
                        </div>

                        {/* TABS */}
                        <div className="OrderSectionButtonChanger">
                            <button className={activeSection === 'onprocess' ? 'activeSeccBtn' : ''} onClick={() => setActiveSection('onprocess')}>On Process</button>
                            <button className={activeSection === 'complete' ? 'activeSeccBtn' : ''} onClick={() => setActiveSection('complete')}>Complete</button>
                            <button className={activeSection === 'canceled' ? 'activeSeccBtn' : ''} onClick={() => setActiveSection('canceled')}>Canceled</button>
                        </div>

                        {/* ON PROCESS LIST */}
                        {activeSection === "onprocess" && (
                            <div className="OnProcessSect">

                                {orders.length === 0 && <p>No active orders</p>}

                                {orders
                                    .filter(o => o.status === "On Process")
                                    .map(order => (
                                        <div key={order.id} className="OrderShowDetail">

                                            <div className="BoxOfOrderPro">
                                                <img src={order.items[0]?.image} alt="" />

                                                <div className="OrderShowDet">
                                                    <p className="OrderProcHead">
                                                        {order.items[0]?.name}
                                                        {order.items.length > 1 && ` +${order.items.length - 1} more`}
                                                    </p>

                                                    <span className="OrderOnProcess">
                                                        <p>{order.date}</p>
                                                        <div>On Process</div>
                                                    </span>

                                                    <div className="ProcessOrderPrice">₹{order.total}</div>
                                                </div>

                                                <button
                                                    className="OrderTrackingButton"
                                                    onClick={() => window.location.href = "/track-order"}
                                                >
                                                    Track Order
                                                </button>
                                            </div>

                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {globalToast && (
                    <Toast message={globalToast} onClose={() => setGlobalToast("")} />
                )}
            </section>
        </>
    )
}

export default HomeSect