import ItemsPage from "./ItemsPage.js";
import UserPage from "./ProfilePage.js";
import LoginPage from "./LoginPage.js";
import RegisterPage from "./RegisterPage.js";
import LogoutComponent from "./LogoutComponent.js";
import ErrorPage from "./ErrorPage.js";

const routes = {
  "/": ItemsPage,
  "/profil": UserPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/logout": LogoutComponent,
  "/error": ErrorPage,
};

let page = document.querySelector("#page");
let navBar = document.querySelector("#navBar");
let componentToRender;

// dictionnary of routes
const Router = () => {
  /* manage to route the right component when the page is loaded */
  window.addEventListener("load", (e) => {
    //console.log("onload page:", [window.location.pathname]);
    componentToRender = routes[window.location.pathname];
    if (!componentToRender)
      return ErrorPage(
        new Error('<div class="text-center"><h3>The ' + window.location.pathname + ' ressource does not exist : /</h3> <br><a href="/" class="btn btn-info">Go back to a safe place</a></div>')
      );
    componentToRender();
  });

  /* manage click on the navBar*/
  const onNavigate = (e) => {
    let uri;
    if (e.target.tagName === "A") {
      e.preventDefault();
      if (e.target.text === "Home") {
        uri = "/";
      } else {
        if(e.target.text === 'Profil'){
          uri="/profil";
        }
        else{
          uri = "/" + e.target.text.toLowerCase();
        }
        
      }
    }
    if (uri) {
      // use Web History API to add current page URL to the user's navigation history & set right URL in the browser (instead of "#")
      window.history.pushState({}, uri, window.location.origin + uri);
      // render the requested component
      // for the components that include JS, we want to assure that the JS included is not runned when the JS file is charged by the browser
      // therefore, those components have to be either a function or a class
      componentToRender = routes[uri];
      if (routes[uri]) {
        componentToRender();
      } else {
        ErrorPage(new Error('<div class="text-center"><h3>The ' + window.location.pathname + ' ressource does not exist : /</h3> <br><a href="/" class="btn btn-info">Go back to a safe place</a></div>'));
      }
    }
  };

  navBar.addEventListener("click", onNavigate);

  // Display the right component when the user use the browsing history
  window.addEventListener("popstate", () => {
    componentToRender = routes[window.location.pathname];
    componentToRender();
  });
};

const RedirectUrl = (uri, data) => {
  // use Web History API to add current page URL to the user's navigation history & set right URL in the browser (instead of "#")
  window.history.pushState({}, uri, window.location.origin + uri);
  // render the requested component
  // for the components that include JS, we want to assure that the JS included is not runned when the JS file is charged by the browser
  // therefore, those components have to be either a function or a class
  componentToRender = routes[uri];
  if (routes[uri]) {
    if(!data)
      componentToRender();
    else
      componentToRender(data);
    
  } else {
    ErrorPage(new Error("The " + uri + " ressource does not exist"));
  }
};

export { Router, RedirectUrl };
