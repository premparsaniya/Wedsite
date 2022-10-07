import React from "react";

function Home() {
  return (
    <section className="home-page">
      <div className="home-img">
        <img
          src="/content/dam/saudi-tourism/media/see/1920x1080/brand-page-hero.jpg"
          alt="BG"
          className="Home-bg-img"
        />
      </div>
      <div className="social-media-icon">
        <img
          src="../images/instagram.svg"
          alt="Instagram Logo"
          className="social-icon"
        />
        <br />
        <img
          src="../images/facebook.svg"
          alt="Instagram Logo"
          className="social-icon"
        />
        <br />
        <img
          src="../images/twitter.svg"
          alt="Instagram Logo"
          className="social-icon"
        />
      </div>
      <div className="home-card"></div>
    </section>
  );
}

export default Home;
