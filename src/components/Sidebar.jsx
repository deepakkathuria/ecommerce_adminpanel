import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const navItems = [
  { label: "Overview", path: "/", icon: "📊" },
  { label: "Products", path: "/products", icon: "📦" },
  { label: "Add Product", path: "/add-product", icon: "➕" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__brand">
        <div>
          <span className="sidebar__logo">Zr</span>
          <strong>Zairi Admin</strong>
        </div>
        <button
          type="button"
          className="sidebar__collapse"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? "⮞" : "⮜"}
        </button>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <p>Need help?</p>
        <Link to="mailto:hello@zairi.co" className="sidebar__support-link">
          Support
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
