import React from "react";

function Navbar() {
  return (
    <header>
      <section className="navbar">
        <img src="../images/Logo2.png" alt="Blog Logo" className="logo-img" />
        <div className="navbar-menu">
          <span className="navbar-menu-title">HOME</span>
          <span>FASHION</span>
          <span>PHOTOGRAPHY</span>
          <span>FOOD</span>
        </div>
      </section>
    </header>
  );
}

export default Navbar;
