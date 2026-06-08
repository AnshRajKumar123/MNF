import React, { useState } from 'react'
import '../ComponentCSS/HoriZontalScroll.css'
import { buttonSectionAssets } from '../assets/assests1'

const HoriZontalScroll = () => {
    const [activeCat, setActiveCat] = useState("all");

    const selectCategory = (slug) => {
        setActiveCat(slug);

        window.dispatchEvent(
            new CustomEvent("filterCategory", { detail: slug })
        );
    };

    return (
        <div className="HorizontalScroll">

            <h2 className="ScrollHeading">Your Top Late-Night Choices!!</h2>

            <div className="ScrollContainer">

                {/* ALL Category */}
                <div
                    className={`ScrollItem ${activeCat === "all" ? "ActiveScrollItem" : ""}`}
                    onClick={() => selectCategory("all")}
                >
                    <div className="ScrollImageBox">
                        <span>ALL</span>
                    </div>
                    <span className="ScrollItemName">All</span>
                </div>

                {/* Render All Categories */}
                {buttonSectionAssets.map((item) => (
                    <div
                        key={item.id}
                        className={`ScrollItem ${activeCat === item.slug ? "ActiveScrollItem" : ""}`}
                        onClick={() => selectCategory(item.slug)}
                    >
                        <div className="ScrollImageBox">
                            <img src={item.image} alt={item.name} />
                        </div>
                        <span className="ScrollItemName">{item.name}</span>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default HoriZontalScroll;