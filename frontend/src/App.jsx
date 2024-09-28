
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import Subcategory from "./pages/SubCategory";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category" element={<Category />} />
        <Route path="/subcategory" element={<Subcategory />} />
        <Route path="/products" element={<Product />} />
       
      </Routes>
    </Router>
  );
}

export default App;
