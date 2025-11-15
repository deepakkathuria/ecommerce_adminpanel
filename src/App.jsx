import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const routeMeta = [
  {
    match: (pathname) => pathname === "/",
    title: "Store Overview",
    subtitle: "Track catalog health and quick insights.",
    actionLabel: "Sync Data",
  },
  {
    match: (pathname) => pathname === "/products",
    title: "Product Catalog",
    subtitle: "Search, filter, and curate every SKU.",
    actionLabel: "Refresh",
  },
  {
    match: (pathname) => pathname === "/add-product",
    title: "Add Product",
    subtitle: "Upload visuals, inventory data, and launch instantly.",
    actionLabel: "Need help?",
  },
  {
    match: (pathname) => pathname.startsWith("/edit-product"),
    title: "Edit Product",
    subtitle: "Keep product information fresh and consistent.",
    actionLabel: "View live",
  },
];

const AppLayout = () => {
  const location = useLocation();
  const meta =
    routeMeta.find((item) => item.match(location.pathname)) ||
    routeMeta[0];

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <header className="app-header">
          <div>
            <p className="app-header__eyebrow">Zairi Admin · {new Date().getFullYear()}</p>
            <h1>{meta.title}</h1>
            <p className="app-header__subtitle">{meta.subtitle}</p>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {meta.actionLabel}
          </button>
        </header>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/add-product" element={<ProductForm />} />
            <Route path="/edit-product/:id" element={<ProductForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-center" theme="colored" autoClose={2800} />
      <AppLayout />
    </Router>
  );
};

export default App;
