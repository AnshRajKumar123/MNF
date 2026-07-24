import { API_URL } from "../../config/api";

const TopProducts = ({ products }) => {

    return (

        <div className="DashboardBentoCard">

            <div className="BentoCardHeader">

                <h3>

                    <i className="bx bxs-trophy"></i>

                    Top Selling Products

                </h3>

            </div>

            <div className="TopProductsList">

                {products.map((product, index) => (

                    <div
                        key={index}
                        className="TopProductRow"
                    >

                        <span className="ProductRank">

                            #{index + 1}

                        </span>

                        <img

                            src={`${API_URL}${product.image}`}

                            alt={product.name}

                        />

                        <div className="ProductInfo">

                            <h4>{product.name}</h4>

                            <span>{product.category}</span>

                        </div>

                        <strong>

                            {product.sold}

                        </strong>

                    </div>

                ))}

            </div>

        </div>

    );

};

export default TopProducts;