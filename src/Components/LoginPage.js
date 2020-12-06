/* In a template literal, the ` (backtick), \ (backslash), and $ (dollar sign) characters should be 
escaped using the escape character \ if they are to be included in their template value. 
By default, all escape sequences in a template literal are ignored.*/
import { getUserSessionData, setUserSessionData } from "../utils/session.js";
import { RedirectUrl } from "./Router.js";
import Navbar from "./Navbar.js";
import { API_URL } from "../utils/server.js";
import { setLayout } from "../utils/render.js";

let loginPage = `<form class="col-6">
<div class="form-group">
  <label for="username">Username</label>
  <input class="form-control" id="username" type="text" name="username" placeholder="Enter your username" required/>
</div>
<div class="form-group">
  <label for="password">Password</label>
  <input class="form-control" id="password" type="password" name="password" placeholder="Enter your password" required/>
</div>
<button class="btn btn-primary" id="btn" type="submit">Submit</button>
<!-- Create an alert component with bootstrap that is not displayed by default-->
<div class="alert alert-danger mt-2 d-none" id="messageBoard"></div><span id="errorMessage"></span>
</form>`;

const LoginPage = () => {
  setLayout("GIC : Login","Game Items Collection","Login Page","My footer");
  let page = document.querySelector("#page");
  page.innerHTML = loginPage;
  let loginForm = document.querySelector("form");
  const user = getUserSessionData();
  if (user) {
    // re-render the navbar for the authenticated user
    Navbar();
    RedirectUrl("/list");
  } else loginForm.addEventListener("submit", onLogin);
};

const onLogin = (e) => {
  e.preventDefault();
  let username = document.getElementById("username");
  let password = document.getElementById("password");

  // remove Error Borders
  removeErrorBoxOn(username);
  removeErrorBoxOn(password);

  if(username.value == '' || password.value ==''){
    if(password.value==''){
      addErrorBoxOn(password);
      var error= new Error("mdp être remplis !");
      onError(error);
    }
    if(username.value==''){
      addErrorBoxOn(username);
      var error= new Error("user être remplis !");
      onError(error);
    }
  }
  else{
    let user = {
      username: username.value,
      password: password.value,
    };
  
    fetch(API_URL + "users/login", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      body: JSON.stringify(user), // body data type must match "Content-Type" header
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(
            "Error code : " + response.status + " : " + response.statusText
          );
        return response.json();
      })
      .then((data) => onUserLogin(data))
      .catch((err) => onError(err));
  }
};

const onUserLogin = (userData) => {
  console.log("onUserLogin:", userData);
  const user = { ...userData, isAutenticated: true };
  setUserSessionData(user);
  // re-render the navbar for the authenticated user
  Navbar();
  RedirectUrl("/");
};

const onError = (err) => {
  let messageBoard = document.querySelector("#messageBoard");
  let errorMessage = "";
  if (err.message.includes("401")){
    errorMessage = "Wrong username or password.";
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    addErrorBoxOn(username);
    addErrorBoxOn(password);
  } 
  else errorMessage = err.message;
  messageBoard.innerText = errorMessage;
  // show the messageBoard div (add relevant Bootstrap class)
  messageBoard.classList.add("d-block");
};

const addErrorBoxOn = (type) =>{
  type.classList.add('border');
  type.classList.add('border-danger');
}
const removeErrorBoxOn = (type) =>{
  type.classList.remove('border');
  type.classList.remove('border-danger');
}

export default LoginPage;
