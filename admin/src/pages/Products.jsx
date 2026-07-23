import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import "../styles/Products.css";
import ProductModal from "../components/products/ProductModal";

const Products = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data.products);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);


    if (loading) {
        return <h2>Loading...</h2>;
    }

    const handleDelete = async (id, name) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${name}"?`
        );

        if (!confirmDelete) return;

        try {

            await deleteProduct(id);

            loadProducts();

        } catch (error) {

            console.error(error);

            alert("Failed to delete product");

        }

    };
    return (
        <div className="ProductsPage">

            <div className="ProductsHeader">

                <h1>Products</h1>

                <div className="ProductsActions">

                    <input
                        type="text"
                        placeholder="Search products..."
                        className="SearchInput"
                    />

                    <button
                        className="AddProductBtn"
                        onClick={() => {

                            setSelectedProduct(null);

                            setOpenModal(true);

                        }}
                    >
                        + Add Product
                    </button>

                </div>

            </div>

            <table className="ProductTable">

                <thead>

                    <tr>

                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Available</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        products.map(product => (

                            <tr key={product._id}>

                                <td>

                                    <img
                                        className="ProductImage"
                                        src={`http://10.59.92.183:3000${product.image}`}
                                        alt={product.name}
                                    />

                                </td>

                                <td>{product.name}</td>

                                <td>{product.category}</td>

                                <td>₹{product.price}</td>

                                <td>

                                    <span
                                        className={
                                            product.isAvailable
                                                ? "Status Active"
                                                : "Status Inactive"
                                        }
                                    >
                                        {product.isAvailable ? "Available" : "Out of Stock"}
                                    </span>

                                </td>

                                <td>

                                    <button
                                        className="ActionBtn EditBtn"
                                        onClick={() => {

                                            setSelectedProduct(product);

                                            setOpenModal(true);

                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="ActionBtn DeleteBtn"
                                        onClick={() => handleDelete(product._id, product.name)}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>
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