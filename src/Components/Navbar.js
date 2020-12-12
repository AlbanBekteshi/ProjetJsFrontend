let navBar = document.querySelector("#navBar");
import {getUserSessionData} from "../utils/session.js";
import gicLogo from "./../images/public/logo.png";

// destructuring assignment
const Navbar = () => {
  let navbar; 
  if (getUserSessionData()) {
    navbar = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-2 w-100" id="navBar">
    <a class="navbar-brand" href="/"><img src="${gicLogo}" width="64" height="64" alt="Logo" id="logo"></a>
    <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarNavAltMarkup"
    aria-controls="navbarNavAltMarkup"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse flex-grow-1 text-right" id="navbarNavAltMarkup">
    <div class="navbar-nav ml-auto flew-nowrap">
      <a class="nav-item nav-link" href="#">Home</a> 
      <a class="nav-item nav-link" href="">Chat Global</a>
      <a class="nav-item nav-link" href="">Profil</a>
      <a class="nav-item nav-link" href="#">Logout</a>
    </div>
  </div>
  </nav>`;
  } else {
    navbar = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-2 w-100" id="navBar">
      <a class="navbar-brand" href="/"><img src="${gicLogo}" width="64" height="64" alt="Logo" id="logo"></a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse flex-grow-1 text-right" id="navbarNavAltMarkup">
        <div class="navbar-nav ml-auto flew-nowrap">
          <a class="nav-item nav-link" href="">Home</a>
          <a class="nav-item nav-link" href="">Register</a>
          <a class="nav-item nav-link" href="">Login</a> 
        </div>
      </div>
    </nav>`;
  }

  navBar.innerHTML = navbar;

  let myAnimation = anime({
    targets: '#logo',
    rotate:180,
    delay:750,
    scale:1.5,
    duration: 500,
    easing:'linear',
    direction:'alternate',
  });
};

export default Navbar;
