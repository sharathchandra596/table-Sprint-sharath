import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // For fetching subcategories
  const [categories, setCategories] = useState([]); // For fetching categories
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productName, setProductName] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState(""); // For subcategory dropdown
  const [selectedCategory, setSelectedCategory] = useState(""); // For category dropdown
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("active");
  const [sequence, setSequence] = useState(0);

  // Fetch categories for the category dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/category/getall");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories for the subcategory dropdown
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/subcategory/getall");
        setSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/product/getall");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle form submission for adding or editing product
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("subcategory", selectedSubcategory);
    formData.append("category", selectedCategory);
    formData.append("image", image);
    formData.append("sequence", sequence);
    formData.append("status", status);

    try {
      if (isEditing) {
        // Edit existing product
        const response = await axios.put(`http://localhost:3000/api/v1/product/edit/${currentProductId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Product updated successfully:", response.data);
        setProducts((prevProducts) =>
          prevProducts.map((product) => (product.id === currentProductId ? response.data : product))
        );
      } else {
        // Add new product
        const response = await axios.post("http://localhost:3000/api/v1/product/addnew", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Product added successfully:", response.data);
        setProducts((prevProducts) => [...prevProducts, response.data]);
      }

      // Reset form values and close the modal after successful submission
      setProductName("");
      setSelectedSubcategory("");
      setSelectedCategory("");
      setImage(null);
      setStatus("active");
      setSequence(0);
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentProductId(null);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/product/delete/${productId}`);
      console.log(`Product with ID ${productId} deleted successfully`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle product editing
  const handleEdit = (product) => {
    setProductName(product.product);
    setSelectedSubcategory(product.subcategory); // Set selected subcategory
    setSelectedCategory(product.category); // Set selected category
    setStatus(product.status);
    setSequence(product.sequence);
    setCurrentProductId(product.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-3/4">
        {/* Navbar */}
        <Navbar />

        {/* Product Content */}
        <div className="p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Products</h2>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsEditing(false);
                setProductName("");
                setSelectedSubcategory("");
                setSelectedCategory("");
                setImage(null);
                setStatus("active");
                setSequence(0);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </div>

          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-yellow-100">
                <th className="py-2">ID</th>
                <th className="py-2">Product</th>
                <th className="py-2">Subcategory</th>
                <th className="py-2">Category</th>
                <th className="py-2">Sequence</th>
                <th className="py-2">Status</th>
                <th className="py-2">Edit</th>
                <th className="py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2">{product.id}</td>
                    <td className="py-2">{product.product}</td>
                    <td className="py-2">{product.subcategory}</td>
                    <td className="py-2">{product.category}</td>
                    <td className="py-2">{product.sequence}</td>
                    <td className="py-2">{product.status}</td>
                    <td className="py-2">
                      <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-4 py-1 rounded">
                        Edit
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md w-1/3">
            <h2 className="text-2xl mb-4">{isEditing ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleFormSubmit}>
              {/* Product Name */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Product</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              {/* Subcategory Dropdown */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subcategory</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.subcategory_name}>
                      {subcategory.subcategory_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.category_name}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  className="w-full px-3 py-2 border rounded-md"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              {/* Status Dropdown */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Sequence */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Sequence</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={sequence}
                  onChange={(e) => setSequence(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
