import React from "react";

function Home() {
  // var event = undefined;
  var balls = document.getElementsByClassName("ball");
  document.onmousemove = function (event) {
    var x = (event.clientX * 100) / window.innerWidth + "%";
    var y = (event.clientY * 100) / window.innerHeight + "%";
    //event.clientX => get the horizontal coordinate of the mouse
    //event.clientY => get the Vertical coordinate of the mouse
    //window.innerWidth => get the browser width
    //window.innerHeight => get the browser height

    for (var i = 0; i < 2; i++) {
      balls[i].style.left = x;
      balls[i].style.top = y;
      balls[i].style.transform = "translate(-" + x + ",-" + y + ")";
    }
  };
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
      <section>
        <div className="inner">
          <div class="ball" />
        </div>
      </section>
    </section>
  );
}

export default Home;
