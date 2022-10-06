import { Routes, Route } from "react-router-dom";
import { Navbar, Home } from "../pages";

function App() {
  window.matchMedia("(prefers-color-scheme: dark)");
  return (
    <section>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </section>
  );
}

export default App;
