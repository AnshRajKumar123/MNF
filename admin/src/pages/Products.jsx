import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import "../styles/Products.css";
import ProductModal from "../components/products/ProductModal";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data.products || []);
        } catch (error) {
            console.error("Error loading catalog:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id, name) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to purge "${name}" from the product catalog?`
        );

        if (!confirmDelete) return;

        try {
            await deleteProduct(id);
            loadProducts();
        } catch (error) {
            console.error(error);
            alert("Failed to delete product from database.");
        }
    };

    // Filter products dynamically based on search query
    const filteredProducts = products.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="ProductsLoadingState">
                <i className="bx bx-radar bx-spin LoadingIcon"></i>
                <h2>Loading Product Catalog Engine...</h2>
                <p>Retrieving dish parameters from backend server</p>
            </div>
        );
    }

    return (
        <div className="ProductsPage">
            {/* TOP HEADER CONTROLS */}
            <div className="ProductsHeader">
                <div className="HeaderTitleGroup">
                    <h1>Product Catalog</h1>
                    <p>Manage restaurant menu items, pricing, and stock status</p>
                </div>

                <div className="ProductsActions">
                    <div className="SearchInputWrapper">
                        <i className="bx bx-search SearchIcon"></i>
                        <input
                            type="text"
                            placeholder="Search dishes or categories..."
                            className="SearchInput"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        className="AddProductBtn"
                        onClick={() => {
                            setSelectedProduct(null);
                            setOpenModal(true);
                        }}
                    >
                        <i className="bx bx-plus"></i> Add New Dish
                    </button>
                </div>
            </div>

            {/* PRODUCT CATALOG DATA TABLE */}
            <div className="TableContainer">
                <table className="ProductTable">
                    <thead>
                        <tr>
                            <th>Dish Image</th>
                            <th>Dish Name</th>
                            <th>Category</th>
                            <th>Food Type</th>
                            <th>Price</th>
                            <th>Stock Status</th>
                            <th className="TextRight">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="EmptyTableMessage">
                                    <i className="bx bx-dish"></i>
                                    <p>No products found matching your search criteria.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <div className="ProductImageFrame">
                                            <img
                                                className="ProductImage"
                                                src={`http://10.59.92.183:3000${product.image}`}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/70?text=No+Image";
                                                }}
                                            />
                                        </div>
                                    </td>

                                    <td>
                                        <div className="ProductNameCell">
                                            <strong className="ProductNameText">{product.name}</strong>
                                            <span className="ProductDescSnippet">
                                                {product.description || "No description provided"}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="CategoryTagPill">{product.category}</span>
                                    </td>

                                    <td>
                                        <span className={`FoodTypeBadge ${product.foodType === "non-veg" ? "NonVeg" : "Veg"}`}>
                                            <span className="DotIndicator"></span>
                                            {product.foodType === "non-veg" ? "Non-Veg" : "Veg"}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="PriceTag">₹{product.price}</span>
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                product.isAvailable
                                                    ? "Status Active"
                                                    : "Status Inactive"
                                            }
                                        >
                                            <span className="PulseStatusDot"></span>
                                            {product.isAvailable ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </td>

                                    <td className="TextRight">
                                        <div className="ActionButtonsRow">
                                            <button
                                                className="ActionBtn EditBtn"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setOpenModal(true);
                                                }}
                                                title="Edit Dish"
                                            >
                                                <i className="bx bx-edit-alt"></i> Edit
                                            </button>

                                            <button
                                                className="ActionBtn DeleteBtn"
                                                onClick={() => handleDelete(product._id, product.name)}
                                                title="Delete Dish"
                                            >
                                                <i className="bx bx-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* EDIT / ADD PRODUCT MODAL DIALOG */}
            <ProductModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={loadProducts}
                product={selectedProduct}
            />
        </div>
    );
};

export default Products;