
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-1/4 bg-gray-100 h-screen">
      <ul className="mt-4">
        <li className="p-4 hover:bg-yellow-100 cursor-pointer">
          <Link to="/" className="flex items-center">
            <span className="ml-4">🏠 Dashboard</span>
          </Link>
        </li>
        <li className="p-4 hover:bg-yellow-100 cursor-pointer">
          <Link to="/category" className="flex items-center">
            <span className="ml-4">📂 Category</span>
          </Link>
        </li>
        <li className="p-4 hover:bg-yellow-100 cursor-pointer">
          <Link to="/subcategory" className="flex items-center">
            <span className="ml-4">📑 Subcategory</span>
          </Link>
        </li>
        <li className="p-4 hover:bg-yellow-100 cursor-pointer">
          <Link to="/products" className="flex items-center">
            <span className="ml-4">📦 Products</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
