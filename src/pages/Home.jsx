import React from "react";

function Home() {
  return (
    <section className="home-page">
      <div className="home-img">
        <img src="../images/BG-img.jpg" alt="BG" className="Home-bg-img" />
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
      <div className="home-card">
        <h1>
          <span>always be</span>
          <div className="message">
            <div className="word1">FASHION</div>
            <div className="word2">PHOTOGRAPY</div>
            <div className="word3">FOOD</div>
          </div>
        </h1>
      </div>
    </section>
  );
}

export default Home;
