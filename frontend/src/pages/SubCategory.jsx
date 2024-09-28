import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Subcategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]); // For fetching categories
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // For dropdown
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("active");
  const [sequence, setSequence] = useState(0);

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/category/getall");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    

    fetchCategories();
  }, []);

  // Fetch subcategories from the API
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/subcategory/getall");
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  useEffect(() => {
    

    fetchSubcategories();
  }, []);

  // Handle form submission for adding or editing subcategory
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("subcategory_name", subcategoryName);
    formData.append("category", selectedCategory);
    formData.append("image", image);
    formData.append("sequence", sequence);
    formData.append("status", status);

    try {
      if (isEditing) {
        // Edit existing subcategory
        const response = await axios.put(`http://localhost:3000/api/v1/subcategory/edit/${currentSubcategoryId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Subcategory updated successfully:", response.data);
        if(response.status===200){
            fetchSubcategories();
        }
        setSubcategories((prevSubcategories) =>
          prevSubcategories.map((subcategory) => (subcategory.id === currentSubcategoryId ? response.data : subcategory))
        );
      } else {
        // Add new subcategory
        const response = await axios.post("http://localhost:3000/api/v1/subcategory/addnew", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Subcategory added successfully:", response.data);
        if(response.status===200){
            fetchSubcategories();
        }
        setSubcategories((prevSubcategories) => [...prevSubcategories, response.data]);
      }

      // Reset form values and close the modal after successful submission
      setSubcategoryName("");
      setSelectedCategory("");
      setImage(null);
      setStatus("active");
      setSequence(0);
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentSubcategoryId(null);
    } catch (error) {
      console.error("Error submitting subcategory:", error);
    }
  };

  // Handle subcategory deletion
  const handleDelete = async (subcategoryId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/subcategory/delete/${subcategoryId}`);
      console.log(`Subcategory with ID ${subcategoryId} deleted successfully`);
      setSubcategories((prevSubcategories) => prevSubcategories.filter((subcategory) => subcategory.id !== subcategoryId));
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  // Handle subcategory editing
  const handleEdit = (subcategory) => {
    setSubcategoryName(subcategory.subcategory_name);
    setSelectedCategory(subcategory.category); // Set selected category
    setStatus(subcategory.status);
    setSequence(subcategory.sequence);
    setCurrentSubcategoryId(subcategory.id);
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

        {/* Subcategory Content */}
        <div className="p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Subcategory</h2>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsEditing(false);
                setSubcategoryName("");
                setSelectedCategory("");
                setImage(null);
                setStatus("active");
                setSequence(0);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Add Subcategory
            </button>
          </div>

          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-yellow-100">
                <th className="py-2">Subcategory Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Image</th>
                <th className="py-2">Sequence</th>
                <th className="py-2">Status</th>
                <th className="py-2">Edit</th>
                <th className="py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.length > 0 ? (
                subcategories.map((subcategory, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2">{subcategory.subcategory_name}</td>
                    <td className="py-2">{subcategory.category}</td>
                    <td className="py-2">
                      <img src={subcategory.image} alt={subcategory.subcategory_name} className="h-12 w-12 object-cover mx-auto" />
                    </td>
                    <td className="py-2">{subcategory.sequence}</td>
                    <td className="py-2">{subcategory.status}</td>
                    <td className="py-2">
                      <button onClick={() => handleEdit(subcategory)} className="bg-blue-500 text-white px-4 py-1 rounded">
                        Edit
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDelete(subcategory.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No subcategories found.
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
            <h2 className="text-2xl mb-4">{isEditing ? "Edit Subcategory" : "Add New Subcategory"}</h2>
            <form onSubmit={handleFormSubmit}>
              {/* Subcategory Name */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subcategory Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  required
                />
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
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              {/* Status */}
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

              <div className="flex justify-between">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  {isEditing ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcategory;
