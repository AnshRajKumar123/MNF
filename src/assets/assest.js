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