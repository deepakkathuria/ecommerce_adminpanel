import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Table, Card, Pagination, Badge } from "react-bootstrap";
import { API_ROUTES } from "../config";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(
//         "https://hammerhead-app-jkdit.ondigitalocean.app/admin/products"
//       );
//       setProducts(response.data.products);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const deleteProduct = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         await axios.delete(
//           `https://hammerhead-app-jkdit.ondigitalocean.app/admin/product/${id}`
//         );
//         fetchProducts();
//       } catch (error) {
//         console.error("Error deleting product:", error);
//       }
//     }
//   };

//   return (
//     <div className="container my-5">
//       <h2 className="mb-1 text-center">📦 Manage Products</h2>
//       <Card 
//       className="shadow-sm">
//         <Card.Body>
//           <Table striped bordered hover responsive>
//             <thead className="bg-dark text-white">
//               <tr>
//                 <th>ID</th>
//                 <th>Image</th>
//                 <th>Name</th>
//                 <th>Price</th>
//                 <th>Category</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product) => {
//                 let images = [];
//                 try {
//                   images = JSON.parse(product.images); // Ensure images are parsed correctly
//                 } catch (error) {
//                   console.error("Error parsing images:", error);
//                 }

//                 const firstImage =
//                   images.length > 0 ? images[0] : "https://via.placeholder.com/100";

//                 return (
//                   <tr key={product.item_id} className="text-center align-middle">
//                     <td>{product.item_id}</td>
//                     <td>
//                       <img
//                         src={firstImage}
//                         alt={product.name}
//                         className="img-thumbnail"
//                         style={{ width: "80px", height: "80px", objectFit: "cover" }}
//                       />
//                     </td>
//                     <td className="fw-bold">{product.name}</td>
//                     <td className="text-success fw-bold">Rs. {product.price}</td>
//                     <td className="text-primary">{product.category}</td>
//                     <td>
//                       <Link to={`/edit-product/${product.item_id}`}>
//                         <Button variant="outline-primary" size="sm" className="me-2">
//                           ✏️ Edit
//                         </Button>
//                       </Link>
//                       <Button
//                         variant="outline-danger"
//                         size="sm"
//                         onClick={() => deleteProduct(product.item_id)}
//                       >
//                         🗑 Delete
//                       </Button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default ProductList;




 

const LIMIT = 15;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isTrendyOnly, setIsTrendyOnly] = useState(false);
  const [isUniqueOnly, setIsUniqueOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchTerm.trim().toLowerCase()),
      250
    );
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, selectedSubcategory, isTrendyOnly, isUniqueOnly]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_ROUTES.adminCategories);
      const formatted = Object.entries(response.data?.categories || {}).map(
        ([name, subs]) => ({
          name,
          subcategories: subs,
        })
      );
      setCategories(formatted);
    } catch (err) {
      console.error("Categories fetch error:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: LIMIT,
      });
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedSubcategory) params.append("subcategory", selectedSubcategory);
      if (isTrendyOnly) params.append("is_trendy", "true");
      if (isUniqueOnly) params.append("is_unique", "true");

      const response = await axios.get(
        `${API_ROUTES.adminProducts}?${params.toString()}`
      );

      setProducts(response.data.products || []);
      setMeta({
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 1,
      });
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("Product fetch error:", err);
      setError("We couldn’t load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await axios.delete(API_ROUTES.adminProduct(id));
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = useMemo(() => {
    const searchValue = debouncedSearch;
    const filtered = products
      .filter((product) => {
        const matchesSearch =
          !searchValue ||
          product.name?.toLowerCase().includes(searchValue) ||
          product.slug?.toLowerCase().includes(searchValue) ||
          product.category?.toLowerCase().includes(searchValue);

        const matchesStock =
          stockFilter === "all" ||
          (stockFilter === "available" && !product.sold_out) ||
          (stockFilter === "sold_out" && product.sold_out);

        return matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "priceAsc":
            return a.price - b.price;
          case "priceDesc":
            return b.price - a.price;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return b.item_id - a.item_id;
        }
      });
    return filtered;
  }, [products, debouncedSearch, sortBy, stockFilter]);

  const viewStats = useMemo(() => {
    const total = filteredProducts.length;
    const trendy = filteredProducts.filter((item) => item.is_trendy).length;
    const unique = filteredProducts.filter((item) => item.is_unique).length;
    const soldOut = filteredProducts.filter((item) => item.sold_out).length;
    return { total, trendy, unique, soldOut };
  }, [filteredProducts]);

  const currentSubcategories =
    categories.find((cat) => cat.name === selectedCategory)?.subcategories ||
    [];

  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Catalog Control</p>
          <h2>Manage every SKU with confidence</h2>
          <p className="muted">
            Showing {viewStats.total} items · Last synced{" "}
            {lastUpdated
              ? new Date(lastUpdated).toLocaleTimeString()
              : "just now"}
          </p>
        </div>
        <div className="header-actions">
          <Button variant="outline-secondary" onClick={fetchProducts}>
            Refresh
          </Button>
          <Link to="/add-product" className="btn btn-primary">
            + Add product
          </Link>
        </div>
      </div>

      <div className="stat-grid">
        <Card className="stat-card stat-card--primary">
          <Card.Body>
            <p className="stat-card__label">Visible</p>
            <p className="stat-card__value">{viewStats.total}</p>
            <span className="stat-card__helper">
              of {meta.total} total products
            </span>
          </Card.Body>
        </Card>
        <Card className="stat-card stat-card--success">
          <Card.Body>
            <p className="stat-card__label">Trending</p>
            <p className="stat-card__value">{viewStats.trendy}</p>
            <span className="stat-card__helper">flagged as trendy</span>
          </Card.Body>
        </Card>
        <Card className="stat-card stat-card--accent">
          <Card.Body>
            <p className="stat-card__label">Unique</p>
            <p className="stat-card__value">{viewStats.unique}</p>
            <span className="stat-card__helper">exclusive drops</span>
          </Card.Body>
        </Card>
        <Card className="stat-card stat-card--warning">
          <Card.Body>
            <p className="stat-card__label">Sold out</p>
            <p className="stat-card__value">{viewStats.soldOut}</p>
            <span className="stat-card__helper">needs restock</span>
          </Card.Body>
        </Card>
      </div>

      <Card className="page-card filters-card">
        <Card.Body>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <input
                type="search"
                className="form-control"
                placeholder="Search by name, slug, or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory("");
                  setCurrentPage(1);
                }}
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Subcategory</label>
              <select
                className="form-select"
                value={selectedSubcategory}
                onChange={(e) => {
                  setSelectedSubcategory(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={!selectedCategory}
              >
                <option value="">All</option>
                {currentSubcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Sort by</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Newest first</option>
                <option value="priceAsc">Price · Low to high</option>
                <option value="priceDesc">Price · High to low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          <div className="chip-row">
            <button
              type="button"
              className={`chip-toggle ${stockFilter === "all" ? "active" : ""}`}
              onClick={() => setStockFilter("all")}
            >
              All stock
            </button>
            <button
              type="button"
              className={`chip-toggle ${
                stockFilter === "available" ? "active" : ""
              }`}
              onClick={() => setStockFilter("available")}
            >
              In stock
            </button>
            <button
              type="button"
              className={`chip-toggle ${
                stockFilter === "sold_out" ? "active" : ""
              }`}
              onClick={() => setStockFilter("sold_out")}
            >
              Sold out
            </button>
            <button
              type="button"
              className={`chip-toggle ${isTrendyOnly ? "active" : ""}`}
              onClick={() => {
                setIsTrendyOnly((prev) => !prev);
                setCurrentPage(1);
              }}
            >
              🔥 Trendy
            </button>
            <button
              type="button"
              className={`chip-toggle ${isUniqueOnly ? "active" : ""}`}
              onClick={() => {
                setIsUniqueOnly((prev) => !prev);
                setCurrentPage(1);
              }}
            >
              💎 Unique
            </button>
            {(selectedCategory ||
              selectedSubcategory ||
              stockFilter !== "all" ||
              isTrendyOnly ||
              isUniqueOnly ||
              searchTerm) && (
              <button
                type="button"
                className="chip-toggle chip-toggle--clear"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedSubcategory("");
                  setStockFilter("all");
                  setIsTrendyOnly(false);
                  setIsUniqueOnly(false);
                  setSearchTerm("");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Card className="page-card">
        <Card.Body>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <Table hover responsive className="align-middle catalog-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Tags</th>
                  <th>Stock</th>
                  <th className="text-end">Price</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  let parsedImages = [];
                  try {
                    parsedImages = Array.isArray(product.images)
                      ? product.images
                      : JSON.parse(product.images || "[]");
                  } catch {
                    parsedImages = [];
                  }
                  const image =
                    parsedImages[0] || "https://via.placeholder.com/80";

                  return (
                    <tr key={product.item_id}>
                      <td>#{product.item_id}</td>
                      <td>
                        <div className="product-cell">
                          <img src={image} alt={product.name} />
                          <div>
                            <strong>{product.name}</strong>
                            <p className="muted">
                              {product.slug || "No slug"} ·{" "}
                              {product.short_name || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="stacked-text">
                          <span>{product.category || "—"}</span>
                          <small className="muted">
                            {product.subcategory || "No subcategory"}
                          </small>
                        </div>
                      </td>
                      <td className="tags-col">
                        {product.is_trendy && (
                          <Badge bg="warning" text="dark">
                            Trendy
                          </Badge>
                        )}
                        {product.is_unique && (
                          <Badge bg="info" text="dark">
                            Unique
                          </Badge>
                        )}
                        {!product.is_trendy && !product.is_unique && (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td>
                        <div className="stacked-text">
                          <span className="fw-semibold">
                            {Number(product.stock_quantity ?? 0)}
                          </span>
                          <span
                            className={`status-pill ${
                              product.sold_out
                                ? "status-pill--danger"
                                : "status-pill--success"
                            }`}
                          >
                            {product.sold_out ? "Sold out" : "Available"}
                          </span>
                        </div>
                      </td>
                      <td className="text-end fw-semibold">
                        ₹ {Number(product.price).toLocaleString()}
                      </td>
                      <td className="text-end">
                        <div className="table-actions">
                          <Link
                            to={`/edit-product/${product.item_id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Edit
                          </Link>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteProduct(product.item_id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}

          {!loading && (
            <Pagination className="justify-content-center mt-3">
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              {[...Array(meta.totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, meta.totalPages))
                }
                disabled={currentPage === meta.totalPages}
              />
            </Pagination>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductList;
