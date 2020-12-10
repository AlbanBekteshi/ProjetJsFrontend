import { RedirectUrl } from "./Router.js";
import Navbar from "./Navbar.js";
import { setUserSessionData,getUserSessionData } from "../utils/session.js";
import { API_URL } from "../utils/server.js";
import { setLayout } from "../utils/render.js";

let registerPage = `<form class="col-12">
<div class="row">
  <div class="form-group col-md-12 col-lg-6">
    <label for="username">Username</label>
    <input class="form-control" id="username" type="text" name="username" placeholder="Enter your username" required/>
  </div>
  <div class="form-group col-md-12 col-lg-6">
    <label for="email">Email</label>
    <input class="form-control" id="email" type="email" name="email" placeholder="Enter your email" pattern="^\\w+([.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,4})+\$" required/>
  </div>
</div>

<div class="row">
  <div class="form-group col-md-12 col-lg-6 mb-0">
    <label for="password">Password</label>
    <input class="form-control" id="password" type="password" name="password" placeholder="Enter your password" required/>
  </div>
  <div class="form-group col-md-12 col-lg-6 mb-0">
    <label for="password2">Password</label>
    <input class="form-control" id="password2" type="password" name="password2" placeholder="Repeat your password" required/>
    <div class="invisible" id="errorPassword">test</div>
  </div>
</div>

<div class="row">
  <div class="form-group col-md-12 col-lg-6">
    <label for="fName">First Name</label>
    <input class="form-control" id="fName" type="text" name="fName" placeholder="Enter your first name" required/>
  </div>
  <div class="form-group col-md-12 col-lg-6">
    <label for="lName">Last name</label>
    <input class="form-control" id="lName" type="text" name="lName" placeholder="Enter your last name" required/>
  </div>
</div>

<div class="row">
  <div class="form-group col-md-12 col-lg-6">
    <label for="avatar">Avatar</label>
    <input class="form-control" id="avatar" type="file" name="avatar" placeholder="Choose your avatar" accept=".jpg,.png,.jpeg"/>
  </div>
</div>

<div>
  <button class="btn btn-primary" id="btn" type="submit">Submit</button>
  <!-- Create an alert component with bootstrap that is not displayed by default-->
  <div class="alert alert-danger mt-2 d-none" id="messageBoard"></div>
</div>

</form>`;



const RegisterPage = () => {
  setLayout("GIC : Register","Game Items Collection","Register Page","My footer");
  let page = document.querySelector("#page");
  page.innerHTML = registerPage;
  let registerForm = document.querySelector("form");
  if (getUserSessionData()) {
    // re-render the navbar for the authenticated user
    Navbar();
    RedirectUrl("/profil");
  }
  else{
    registerForm.addEventListener("submit", onRegister);
  }
};

function clearErrorBox(){
  document.getElementById("email").classList.remove("border");
  document.getElementById("email").classList.remove("border-danger");
  document.getElementById("username").classList.remove("border");
  document.getElementById("username").classList.remove("border-danger");
  removeErrorBoxOn(email);
  removeErrorBoxOn(password);
  removeErrorBoxOn(password2);
}

const onRegister = (e) => {
  e.preventDefault();
  var password = document.getElementById("password");
  var password2 = document.getElementById("password2");
  var email = document.getElementById("email");
  clearErrorBox();
  
  // Email Verification
  if(isEmailGoodFormat(email)){
    
    //Password verification
    if(password.value!=password2.value){
      var error = new Error("Les mots de passes ne sont pas identiques");
      addErrorBoxOn(password);
      addErrorBoxOn(password2);
      onError(error);
    }
    else{
      //email + password OK => register user
      let user = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        fName: document.getElementById("fName").value,
        lName: document.getElementById("lName").value,
      };

      fetch(API_URL + "users/", {
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
        .then((data) => onUserRegistration(data))
        .catch((err) => onError(err));
    }
  }
};

const onUserRegistration = (userData) => {
  const user = { ...userData, isAutenticated: true };
  setUserSessionData(user);
  // re-render the navbar for the authenticated user
  Navbar();
  RedirectUrl("/");
};

const onError = (err) => {
  let messageBoard = document.querySelector("#messageBoard");
  let errorMessage = "";
  
  if (err.message.includes("409")){
    var email=document.getElementById("email");
    addErrorBoxOn(email);
    errorMessage = "This email is already used";
  }
  else{
    if(err.message.includes("410")){
      var username = document.getElementById("username");
      addErrorBoxOn(username);
      errorMessage = "This username is already used";
    }
    else errorMessage = err.message;
  }
  
  messageBoard.innerText = errorMessage;
  // show the messageBoard div (add relevant Bootstrap class)
  messageBoard.classList.add("d-block");
};

function isEmailGoodFormat(email){
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!emailRegex.test(email.value)){
    var error = new Error("Le format de l'email est incorrect !");
    email.classList.add('border');
    email.classList.add('border-danger');
    onError(error);
    return false;
  }
  return true;
}

const addErrorBoxOn = (type) =>{
  type.classList.add('border');
  type.classList.add('border-danger');
}
const removeErrorBoxOn = (type) =>{
  type.classList.remove('border');
  type.classList.remove('border-danger');
}

export default RegisterPage;
