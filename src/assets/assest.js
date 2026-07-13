import WebLogo from './img/WebLogo.png'
import GooglePlay from './img/GooglePlay.avif'
import IOS from './img/IOS.avif'
import HeroVideo from './img/HeroVid.mp4'
import MainMobile from './img/MainMobile.avif'
import Calendar from './img/Calendar.avif'
import healthy from './img/healthy.avif'
import VegMode from './img/VegMode.avif'
import Party from './img/Party.avif'
import Gourmet from './img/Gourmet.avif'
import Offer from './img/Offer.avif'
import PrivacyPolicy from './file/MNF Privacy Policy.pdf.pdf'
import SecurityPolicy from './file/MNF Security Policy.pdf.pdf'
import TermsofService from './file/MNF Terms of Service.pdf.pdf'
import AbsoluteBurg from './img/AbsoluteBurg.avif'
import AbsoluteLeav from './img/AbsoluteLeav.avif'
import AbsolutePizz from './img/AbsolutePizz.avif'
import AbsoluteTom from './img/AbsoluteTom.avif'
import SwastikImg from './img/SwastikImg.png'
import ManOrder from './img/ManOrder.png'
import AppMobileView from './img/AppMobileView.avif'
import AboutImage from './img/AboutImage.jpeg'
import CommunityFirst from './img/CommunityFirst.jpg'
import Sustainability from './img/Sustainability.jpg'
import QualityIngredients from './img/QualityIngredients.avif'
import AdityaPhoto from './img/AdityaPhoto.jpeg'
import AnshPhoto from './img/AnshPhoto.jpeg'
import AyushPhoto from './img/AyushPhoto.jpeg'
import DeliveryPartner from './img/DeliveryPartner.png'
import MidNightQR from './img/MidNightQR.png'

export const ResturantIG = {
    WebLogo,
    HeroVideo,
    GooglePlay,
    IOS,
    MainMobile,
    Calendar,
    healthy,
    VegMode,
    Party,
    Gourmet,
    Offer,
    PrivacyPolicy,
    SecurityPolicy,
    TermsofService,
    AbsoluteTom,
    AbsoluteBurg,
    AbsoluteLeav,
    AbsolutePizz,
    SwastikImg,
    ManOrder,
    AppMobileView,
    AboutImage,
    CommunityFirst,
    Sustainability,
    QualityIngredients,
    AdityaPhoto,
    AnshPhoto,
    AyushPhoto,
    DeliveryPartner,
    MidNightQR,
}

export const midnightFoodData = {
    branding: {
        title: "MidNight N Food",
        tagline: "Late Night Cravings, Delivered Smooth."
    },
    navigation: {
        home: "/mainWebsite",
        menu: "/mainWebsite/menu",
        cart: "/mainWebsite/cart"
    },
    asideSettings: {
        links: [
            { label: "Feedback", path: "#" },
            { label: "Bulk Order", path: "#" },
            { label: "Profile", path: "/profile" },
            { label: "About Us", path: "/about" },
            { label: "Terms and Conditions", path: "#" }
        ],
        toggleLabel: "Oceanic Shift"
    },
    navMenuOptions: [
        { label: "Order Tracking", action: "openOrderDetail" },
        { label: "About Us", path: "/about" },
        { label: "Report a Fraud", path: "/report-fraud" },
        { label: "Help and Support", path: "/help-support" }
    ],

    anotherNav: {
        moreLabel: "More",
        options: [
            { label: "Order Tracking", action: "openOrderDetail" },
            { label: "About Us", path: "/about" },
            { label: "Report a Fraud", path: "/report-fraud" },
            { label: "Help and Support", path: "/help-support" }
        ]
    }
};

export const midnightMenuData = {
    labels: {
        detailHeading: "Item Profile Specifications",
        quantitySelect: "Configure Quantity Matrix",
        ctaAdd: "Add to Cart",
        toastUpdate: "Quantity Adjusted 🌊",
        toastAdd: "Logged to Cart Node 🛒"
    }
};

export const midnightCatalogData = {
    scrollHeading: "Your Top Late-Night Choices",
    allLabel: "All Categories",
    allSlug: "all"
};

export const midnightHomeData = {
    heroBanner: {
        tagline: "Limited Time Offer!",
        title: "Get Special Discount",
        percentage: "35% OFF",
        disclaimer: "All restaurants available | T&C Applied",
        ctaText: "Claim Discount"
    },
    sections: {
        gridTitle: "Explore Popular Dishes 🍴",
        productDetailTitle: "Item Specifications",
        orderDetailsTitle: "Order Details",
        noOrders: "No active orders registered."
    },
    tabs: [
        { id: "onprocess", label: "On Process" },
        { id: "complete", label: "Complete" },
        { id: "canceled", label: "Canceled" }
    ]
};

export const midnightSearchData = {
    labels: {
        headline: "Search Query Results",
        emptyState: "No corresponding food items found inside the active registry.",
        detailHeading: "Item Profile Specifications",
        priceLabel: "Price Settlement",
        ctaAdd: "Add to Cart"
    }
};

export const midnightCartData = {
    labels: {
        title: "Your Cart",
        emptyText: "Your collection is currently unallocated.",
        summaryTitle: "Settlement Summary",
        subtotal: "Subtotal Ledger",
        shipping: "Logistics Shipping",
        deliveryType: "Transport Speed",
        tip: "Rider Gratuity",
        total: "Total Authorization",
        checkoutBtn: "Authorize Checkout",
        freeDeliverySuccess: "Congratulations! You unlocked FREE Delivery 🎉",
        freeDeliveryProgress: "Add ₹{amount} more for FREE Delivery",
        freePopupText: "🎉 Free Delivery Unlocked! You saved ₹40 on shipping."
    },
    tabs: [
        { id: "delivery", label: "Delivery Type" },
        { id: "tip", label: "Tip Matrix" },
        { id: "instruction", label: "Instructions" }
    ],
    coupon: {
        title: "Apply Promotional Token",
        placeholder: "Enter token signature",
        redeemBtn: "Redeem"
    }
};

export const midnightProfileData = {
    labels: {
        fallbackLetter: "A",
        fallbackName: "Your Name Here",
        uploadBtn: "Upload Profile Image",
        removeBtn: "Purge Asset Image",
        saveBtn: "Save Profile Parameters",
        nameLabel: "Authorized Profile Identity :",
        phoneLabel: "Phone Number :",
        emailLabel: "Secure Email ID :",
        buildingLabel: "Building / House Name :",
        addressLabel: "Physical Dispatch Address :",
        pincodeLabel: "Pin Code :",
        genderLabel: "Bio Gender :"
    },
    genderOptions: [
        { label: "Male", icon: "👨" },
        { label: "Female", icon: "👩" },
        { label: "Other", icon: "🌈" }
    ],
    countries: [
        { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
        { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
        { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
        { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
        { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺" }
    ]
};

export const midnightAboutData = {
    banner: {
        title: "Our Story: From a Simple Idea to Your Table",
        subtitle: "Discover the passion and dedication that goes into every magical bite we create."
    },
    journey: {
        title: "Our Journey",
        p1: "The foundation of MidNight N Food emerged from a basic late-night experience. The team leader Ayush Kumar and backend developer Aditya Raj stepped out for tea during their coding break. The team members stood under streetlights while discussing the absence of a service which would understand midnight food desires. The team members from student origins created this startup to serve students.",
        p2: "The university students faced MST (Mid-Semester Tests) at that particular time. Students used their evenings to create during the time when their days were filled with academic work and school responsibilities. The team members Ayush Kumar developed the concept while Aditya Raj constructed the foundation and Ansh Raj designed the user interface and user experience.",
        p3: "The team members experienced minimal sleep but generated countless ideas while maintaining strong motivation levels. Our goal was to create a meaningful platform which would unite late-night food cravings with high-quality comfort and easy access.",
        p4: "Our initial service area covered a 5–7 km radius but we aim to expand our reach to all hostels and PGs and night-owls throughout the entire city. The service operates as our dedication to create comfort during nighttime hours."
    },
    mission: {
        tagline: "What we believe in",
        title: "Our Mission & Values",
        description: "Our company exists to create unforgettable late-night food experiences for all customers. The team at MidNight N Food understands that excellent food provides comfort and happiness to people who need it most during late-night hunger. Our values determine all our decisions starting from ingredient selection to delivering hot meals directly to customers' homes.",
        cards: [
            { title: "Quality Ingredients", text: "We carefully source fresh, high-quality ingredients to make every late-night meal taste exceptional. Your midnight cravings deserve the best — and that’s exactly what we serve." },
            { title: "Sustainability", text: "We’re committed to responsible cooking, eco-friendly packaging, and reducing waste wherever possible. Great food shouldn’t cost the planet — even at midnight." },
            { title: "Community First", text: "We believe in giving back and supporting the people who support us. From local suppliers to night-shift workers, our community inspires everything we do." }
        ]
    },
    team: {
        title: "The People Behind the Munch",
        subtitle: "Our team is a passionate group of night-owls, food lovers, and creators dedicated to making your late-night experience unforgettable. From the kitchen to your doorstep, we work around the clock to bring you comfort, flavor, and freshness — exactly when you need it."
    },
    cta: {
        title: "Ready to Satisfy Your Cravings?",
        subtitle: "Join the MNF family and discover your new favorite late-night meals. Explore our menu filled with fresh flavors and crave-worthy ingredients.",
        btnText: "Crave Mode: ON"
    }
};