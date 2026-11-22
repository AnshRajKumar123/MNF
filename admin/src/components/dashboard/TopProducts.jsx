import React from "react";
import { getImageUrl } from "../../utils/getImageUrl";

const TopProducts = ({ products }) => {
    const defaultDishImage = "https://via.placeholder.com/55?text=Dish";
    return (
        <div className="DashboardBentoCard">
            <div className="BentoCardHeader">
                <h3>
                    <i className="bx bxs-trophy"></i>
                    Top Selling Dishes
                </h3>
            </div>

            <div className="TopProductsList">
                {(!products || products.length === 0) ? (
                    <p className="EmptyText">No sales records available yet.</p>
                ) : (
                    products.map((product, index) => (
                        <div key={index} className="TopProductRow">
                            <span className={`ProductRank Rank-${index + 1}`}>
                                #{index + 1}
                            </span>

                            <div className="TopProductImgFrame">
                                <img
                                    src={product.image ? getImageUrl(product.image) : defaultDishImage}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = defaultDishImage;
                                    }}
                                />
                            </div>

                            <div className="ProductInfo">
                                <h4>{product.name}</h4>
                                <span>{product.category || "General"}</span>
                            </div>

                            <div className="SellsTag">
                                <strong>{product.sold}</strong>
                                <small>Sold</small>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopProducts;