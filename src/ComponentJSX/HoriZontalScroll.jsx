import React, { useState } from 'react';
import '../ComponentCSS/HoriZontalScroll.css';
import { buttonSectionAssets } from '../assets/assests1';
import { midnightCatalogData } from '../assets/assest';

const HoriZontalScroll = () => {
    const [activeCat, setActiveCat] = useState(midnightCatalogData.allSlug);

    const selectCategory = (slug) => {
        setActiveCat(slug);
        window.dispatchEvent(
            new CustomEvent("filterCategory", { detail: slug })
        );
    };

    return (
        <div className="ProOceanicScrollWrapper">
            <h2 className="ProScrollHeading">{midnightCatalogData.scrollHeading}</h2>

            <div className="ProScrollTrack">
                {/* ALL Category Item Option */}
                <div
                    className={`ProScrollCardItem ${activeCat === midnightCatalogData.allSlug ? "scroll-item-active" : ""}`}
                    onClick={() => selectCategory(midnightCatalogData.allSlug)}
                >
                    <div className="ProScrollImageShield text-badge-shield">
                        <span>ALL</span>
                    </div>
                    <span className="ProScrollCardName">{midnightCatalogData.allLabel}</span>
                </div>

                {/* Render Dynamic Categories */}
                {buttonSectionAssets.map((item) => (
                    <div
                        key={item.id}
                        className={`ProScrollCardItem ${activeCat === item.slug ? "scroll-item-active" : ""}`}
                        onClick={() => selectCategory(item.slug)}
                    >
                        <div className="ProScrollImageShield">
                            <img src={item.image} alt={item.name} />
                        </div>
                        <span className="ProScrollCardName">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HoriZontalScroll;