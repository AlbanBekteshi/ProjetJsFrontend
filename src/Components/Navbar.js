let navBar = document.querySelector("#navBar");
import {getUserSessionData} from "../utils/session.js";
// destructuring assignment
const Navbar = () => {
  let navbar;
  let user = getUserSessionData();    
  if (user) {
    navbar = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-2 w-100" id="navBar">
    <a class="navbar-brand" href="/"><img src="" width="32" height="32" alt="Logo"></a>
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
      <a class="nav-item nav-link text-white" href="#">Home</a>    
      <a class="nav-item nav-link text-white" href="#">List</a>
      <a class="nav-item nav-link text-white" href="">Profil</a>
      <a class="nav-item nav-link text-white" href="#">Logout</a>
    </div>
  </div>
  </nav>`;
  } else {
    navbar = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-2 w-100" id="navBar">
      <a class="navbar-brand" href="/"><img src="" width="32" height="32" alt="Logo"></a>
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
          <a class="nav-item nav-link" href="#">Register</a>
          <a class="nav-item nav-link" href="#">Login</a> 
        </div>
      </div>
    </nav>`;
  }

  return (navBar.innerHTML = navbar);
};

export default Navbar;
