import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";





const App = () => {
  return (
    <Router>
            <ToastContainer />

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/add-product" element={<ProductForm />} />
            <Route path="/edit-product/:id" element={<ProductForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
