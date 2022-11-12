import React, { useEffect, useState } from "react";

function Navbar() {
  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setShow(true);
      } else {
        setShow(false);
      }
      setLastScrollY(window.scrollY);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);
  

  return (
    <>
      <header className="header">
        <section className={`navbar ${show && "navbar-hidden"}`}>
          <img src="../images/Logo2.png" alt="Blog Logo" className="logo-img" />
          <div className="navbar-menu">
            <span className="navbar-menu-title">HOME</span>
            <span>FASHION</span>
            <span>PHOTOGRAPHY</span>
            <span>FOOD</span>
          </div>
        </section>
      </header>
    </>
  );
}

export default Navbar;
