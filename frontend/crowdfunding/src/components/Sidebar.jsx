import React from "react";

const Sidebar = ({ setActivePage }) => {
  const menuStyle = {
    backgroundColor: "#1e1e1e",
    width: "220px",
    padding: "2rem 1rem",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
  };

  const btnStyle = {
    backgroundColor: "#333",
    border: "none",
    padding: "0.75rem 1rem",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    textAlign: "left",
    transition: "background-color 0.2s",
  };

  const hoverEffect = (e) => {
    e.target.style.backgroundColor = "#444";
  };

  const removeHover = (e) => {
    e.target.style.backgroundColor = "#333";
  };

  return (
    <div style={menuStyle}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}> CrowdFunding Menu</h2>
      <button
        onClick={() => setActivePage("create")}
        style={btnStyle}
        onMouseEnter={hoverEffect}
        onMouseLeave={removeHover}
      >
         Create Campaign
      </button>
      <button
        onClick={() => setActivePage("view")}
        style={btnStyle}
        onMouseEnter={hoverEffect}
        onMouseLeave={removeHover}
      >
         View Campaigns
      </button>
      <button
        onClick={() => setActivePage("donate")}
        style={btnStyle}
        onMouseEnter={hoverEffect}
        onMouseLeave={removeHover}
      >
         Donate
      </button>
      <button
        onClick={() => setActivePage("my")}
        style={btnStyle}
        onMouseEnter={hoverEffect}
        onMouseLeave={removeHover}
      >
         My Campaigns
      </button>
    </div>
  );
};

export default Sidebar;
