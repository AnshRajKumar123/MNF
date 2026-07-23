import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import "../styles/Products.css";

const Products = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
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
        loadProducts();
    }, []);
    if (loading) {
        return <h2>Loading...</h2>;
    }
    return (
        <div className="ProductsPage">
            <div className="ProductsHeader">
                <h1>Products</h1>
            </div>
            <table className="ProductTable">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>
                                <img
                                    className="ProductImage"
                                    src={`http://10.59.92.183:3000${product.image}`}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = "https://placehold.co/70x70?text=No+Image";
                                    }}
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>₹{product.price}</td>
                            <td>
                                <button className="ActionBtn EditBtn">
                                    Edit
                                </button>
                                <button className="ActionBtn DeleteBtn">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Products;