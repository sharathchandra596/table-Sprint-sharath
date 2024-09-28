
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const Category = () => {
  const [categories, setCategories] = useState([]); // Initialize with an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To check if we are in editing mode
  const [currentCategoryId, setCurrentCategoryId] = useState(null); // Store the ID of the category being edited
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("active");
  const [sequence, setSequence] = useState(0);

  // Handle form submission for adding or editing category
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_name", categoryName);
    formData.append("image", image);
    formData.append("sequence", sequence);
    formData.append("status", status);

    try {
      if (isEditing) {
        // Edit existing category
        const response = await axios.put(`http://localhost:3000/api/v1/category/edit/${currentCategoryId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Category updated successfully:", response.status);
        if(response.status===200){
          fetchCategories();
        }
        

        // Update the categories list with the edited category
        // setCategories((prevCategories) =>
        //   prevCategories.map((category) => (category.id === currentCategoryId ? response.data : category))
        // );
      } else {
        // Add new category
        const response = await axios.post("http://localhost:3000/api/v1/category/addnew", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Category added successfully:", response.data);
        setCategories((prevCategories) => [...prevCategories, response.data]);
      }

      // Reset form values and close the modal after successful submission
      setCategoryName("");
      setImage(null);
      setStatus("active");
      setSequence(0);
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentCategoryId(null); // Reset current category ID
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };

  // Handle category deletion
  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/category/delete/${categoryId}`);
      console.log(`Category with ID ${categoryId} deleted successfully`);

      // Remove the deleted category from the state
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Handle category editing
  const handleEdit = (category) => {
    // Set the form values with the selected category's data
    setCategoryName(category.category_name);
    setStatus(category.status);
    setSequence(category.sequence);
    setCurrentCategoryId(category.id); // Store the ID of the category being edited
    setIsEditing(true); // We are now in editing mode
    setIsModalOpen(true); // Open the modal
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/category/getall");
      console.log("API Response:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    
    fetchCategories();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-3/4">
        {/* Navbar */}
        <Navbar />

        {/* Category Content */}
        <div className="p-6 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Category</h2>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsEditing(false); // Make sure we are not in editing mode
                setCategoryName(""); // Clear the form
                setImage(null);
                setStatus("active");
                setSequence(0);
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Add Category
            </button>
          </div>

          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-yellow-100">
                <th className="py-2">Id</th>
                <th className="py-2">Category Name</th>
                <th className="py-2">Image</th>
                <th className="py-2">Status</th>
                <th className="py-2">Sequence</th>
                <th className="py-2">Edit</th>
                <th className="py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2">{category.id}</td>
                    <td className="py-2">{category.category_name}</td>
                    <td className="py-2">
                      <img src={category.image} alt={category.category_name} className="h-12 w-12 object-cover mx-auto" />
                    </td>
                    <td className="py-2">{category.status}</td>
                    <td className="py-2">{category.sequence}</td>
                    <td className="py-2">
                      <button onClick={() => handleEdit(category)} className="bg-blue-500 text-white px-4 py-1 rounded">
                        Edit
                      </button>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDelete(category.id)}
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
                    No categories found.
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
            <h2 className="text-2xl mb-4">{isEditing ? "Edit Category" : "Add New Category"}</h2>
            <form onSubmit={handleFormSubmit}>
              {/* Category Name */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
                  {isEditing ? "Update Category" : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
