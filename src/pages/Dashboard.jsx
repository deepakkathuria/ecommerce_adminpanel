import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, Table, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API_ROUTES } from "../config";

const DEFAULT_STATS = {
  total: 0,
  available: 0,
  soldOut: 0,
  trendy: 0,
  unique: 0,
  lastSync: null,
};

const Dashboard = () => {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [recentProducts, setRecentProducts] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSnapshot();
  }, []);

  const fetchSnapshot = async () => {
    setLoading(true);
    setError("");
    try {
      const limit = 250;
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_ROUTES.adminProducts}?page=1&limit=${limit}`),
        axios.get(API_ROUTES.adminCategories),
      ]);

      const { products = [], total = 0 } = productsRes.data || {};
      const trendy = products.filter((item) => item.is_trendy).length;
      const unique = products.filter((item) => item.is_unique).length;
      const soldOut = products.filter((item) => item.sold_out).length;
      const available = total - soldOut;

      setStats({
        total,
        available: available < 0 ? 0 : available,
        soldOut,
        trendy,
        unique,
        lastSync: new Date().toISOString(),
      });

      const latest = [...products]
        .sort((a, b) => b.item_id - a.item_id)
        .slice(0, 6);
      setRecentProducts(latest);

      const categoryMap = categoriesRes.data?.categories || {};
      const breakdown = Object.entries(categoryMap).map(([name, subs]) => ({
        name,
        subCount: subs.length,
        productCount: products.filter(
          (product) => product.category === name
        ).length,
      }));
      setCategoryBreakdown(breakdown);
    } catch (err) {
      setError("Unable to refresh dashboard right now.");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = useMemo(
    () => [
      {
        label: "Total Products",
        value: stats.total,
        accent: "stat-card--primary",
        helper: "Synced from DB",
      },
      {
        label: "Available Now",
        value: stats.available,
        accent: "stat-card--success",
        helper: "Ready for sale",
      },
      {
        label: "Sold Out",
        value: stats.soldOut,
        accent: "stat-card--warning",
        helper: "Needs restock",
      },
      {
        label: "Hero SKUs",
        value: stats.trendy + stats.unique,
        accent: "stat-card--accent",
        helper: `${stats.trendy} trending · ${stats.unique} unique`,
      },
    ],
    [stats]
  );

  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Realtime Snapshot</p>
          <h2>Inventory health at a glance</h2>
          <p className="muted">
            {stats.lastSync
              ? `Last synced ${new Date(stats.lastSync).toLocaleTimeString()}`
              : "Syncing live data..."}
          </p>
        </div>
        <button className="ghost-button" onClick={fetchSnapshot} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh data"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="stat-grid">
        {statCards.map((card) => (
          <Card className={`stat-card ${card.accent}`} key={card.label}>
            <Card.Body>
              <p className="stat-card__label">{card.label}</p>
              <p className="stat-card__value">{card.value}</p>
              <span className="stat-card__helper">{card.helper}</span>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="dashboard-grid">
        <Card className="page-card">
          <Card.Body>
            <div className="section-header section-header--compact">
              <div>
                <p className="eyebrow">Newest Additions</p>
                <h3>Recently published products</h3>
              </div>
              <Link to="/products" className="ghost-button">
                View catalog
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" />
              </div>
            ) : (
              <Table hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product) => (
                    <tr key={product.item_id}>
                      <td>#{product.item_id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>₹ {product.price}</td>
                      <td>
                        <Badge bg={product.sold_out ? "danger" : "success"}>
                          {product.sold_out ? "Sold out" : "Live"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        <Card className="page-card">
          <Card.Body>
            <div className="section-header section-header--compact">
              <div>
                <p className="eyebrow">Category Coverage</p>
                <h3>Where your products live</h3>
              </div>
            </div>
            {categoryBreakdown.length === 0 ? (
              <p className="muted">No category data yet.</p>
            ) : (
              <ul className="category-list">
                {categoryBreakdown.map((entry) => (
                  <li key={entry.name}>
                    <div>
                      <strong>{entry.name}</strong>
                      <p className="muted">
                        {entry.subCount} subcategories · {entry.productCount} SKUs
                      </p>
                    </div>
                    <Badge bg="light" text="dark">
                      {Math.round(
                        entry.productCount === 0
                          ? 0
                          : (entry.productCount / Math.max(stats.total, 1)) * 100
                      )}
                      %
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
