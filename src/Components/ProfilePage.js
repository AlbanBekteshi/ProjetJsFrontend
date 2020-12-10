import { RedirectUrl } from "./Router.js";
import { getUserSessionData } from "../utils/session.js";
import { API_URL } from "../utils/server.js";
import { setLayout } from "../utils/render.js";
import avatar1 from "./../images/avatars/1.png";
import avatar2 from "./../images/avatars/2.png";
import avatar3 from "./../images/avatars/3.png";
import avatar4 from "./../images/avatars/4.png";
import avatar5 from "./../images/avatars/5.png";
import avatar6 from "./../images/avatars/6.png";
import avatar7 from "./../images/avatars/7.png";
import avatar8 from "./../images/avatars/8.png";
import UserList from "./UserList";

let avatarList = [avatar1,avatar2,avatar3,avatar4,avatar5,avatar6,avatar7,avatar8];

let page = document.querySelector("#page");

const ProfilPage = () => {
  const userCredential = getUserSessionData();
  if (!userCredential) RedirectUrl("/error", 'Resource not authorized. Please <a href="/login">login</a>.');

  // get current user
  fetch(API_URL + "users/"+userCredential.idUser, {
    method: "GET",
    headers: {
      Authorization: userCredential.token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        let fullErrorMessage =
          " Error code : " +
          response.status +
          " : " +
          response.statusText +
          "/nMessage : ";
        return response.text().then((errorMessage) => {
          fullErrorMessage += errorMessage;
          return fullErrorMessage;
        });
      }
      return response.json();
    })
    .then((user) => {
      if (typeof user === "string") onError(user);
      else ProfilPage2(user);
    })
    .catch((err) => onError(err));
};

const ProfilPage2 = (user) =>{
  const userCredential = getUserSessionData();
  if (!userCredential) RedirectUrl("/error", 'Resource not authorized. Please <a href="/login">login</a>.');

  fetch(API_URL+"items/user/"+userCredential.idUser, {
    method:"GET",
    headers:{
      Authorization: userCredential.token,
    },
  }).then((response) => {
    if (!response.ok) {
      let fullErrorMessage =
        " Error code : " +
        response.status +
        " : " +
        response.statusText +
        "/nMessage : ";
      return response.text().then((errorMessage) => {
        fullErrorMessage += errorMessage;
        return fullErrorMessage;
      });
    }
    return response.json();
  }).then((items) =>{
    if(typeof items==="string") onError(items);
    else onUserPage(user,items);
  }).catch((err) => onError(err));
  
};

const onUserPage = (user,items) => {
  UserList();
    setLayout("GIC : Profil de  "+user.username,"Game Items Collection",`Mon profil`,"My footer");
    let userPage = `
        <div class="row col-12 mt-4" id="mainProfilDiv">
            <!--Photo de profil-->
            <div class="col-sm-6 col-md-5 mb-3 mb-md-0">
                <img src="${avatarList[user.avatar-1]}" class="rounded mx-auto d-block" alt="Profile picture" width=300 height=300>
            </div>
            
            <!--Données Profil-->
            <div class="col-sm-12 col-md-7 my-auto">
                <h5 class="text-underline">Username : ${user.username}</h5><br>
                <h5 class="text-underline">Email : ${user.email}</h5><br>
                <h5 class="text-underline">Nom : ${user.lName}</h5><br>
                <h5 class="text-underline">Prénom : ${user.fName}</h5><br>

                <button type="button" class="btn btn-outline-primary" alt="Modifier son profil" id="btnModifyProfil">
                  Modifier Profil 
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-wrench" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364L.102 2.223zm13.37 9.019L13 11l-.471.242-.529.026-.287.445-.445.287-.026.529L11 13l.242.471.026.529.445.287.287.445.529.026L13 15l.471-.242.529-.026.287-.445.445-.287.026-.529L15 13l-.242-.471-.026-.529-.445-.287-.287-.445-.529-.026z"></path>
                  </svg>
                </button>
            </div>
        </div>

        <h3 class="col-sm-12">Mes items</h3>

        <div class="row mt-3 col-12 pl-3">`;
        
        //création auto des items
        if(items[0]!=null){
          items.forEach(item => {
            userPage+=`
              <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div class="card bg-secondary p-1 mb-2">
                    <img src="https://source.unsplash.com/300x300" class="card-img-top mt-1" alt="ItemImg">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${item.name}</h5>
                        <p class="card-text">
                            <u>Jeu :</u> ${item.jeu}<br>
                            <u>Description :</u> ${item.description}<br>
                            <u>Prix :</u> ${item.price}<br>
                        </p>
                    </div>
                </div>  
              </div>
            `;
          });
        }
        else{ userPage+=`<div class="ml-3">Aucun items</div>`;}
        
    userPage+=`
        </div>
    `;

    //render the normal final page (sans modifier)
    page.innerHTML = userPage;

    let btnModifierProfil = document.getElementById("btnModifyProfil");
    btnModifierProfil.addEventListener("click",function(e){
      e.preventDefault();
      //render the page without profile modification form
      renderModifyProfil(user);
    });
};

const onError = (err) => {
  console.error("UserListPage::onError:", err);
  let errorMessage;
  if (err.message) {
    errorMessage = err.message;
  } else errorMessage = err;
  if (errorMessage.includes("jwt expired"))
    errorMessage += "<br> Please logout first, then login.";
  RedirectUrl("/error", errorMessage);
};

const renderModifyProfil = (user)=>{
  console.log(user);

  //form page to modify profil
  let modifyUserPage = `
      <div class="row alert alert-danger mt-2 d-none" id="messageBoard"></div>
      <div class="col-sm-6 col-md-5 mb-3 mb-md-0">
        <form class="row">
          <div class="custom-control custom-radio image-checkbox my-2 mr-2">
            <input type="radio" class="custom-control-input" id="a1" name="avatarInput">
            <label class="custom-control-label" for="a1">
              <img src="${avatar1}" alt="avatar1" class="img-fluid">
            </label>
          </div>
          <div class="custom-control custom-radio image-checkbox my-2 mr-2">
            <input type="radio" class="custom-control-input" id="a2" name="avatarInput" value="2">
            <label class="custom-control-label" for="a2">
              <img src="${avatar2}" alt="avatar1" class="img-fluid">
            </label>
          </div>
          <div class="custom-control custom-radio image-checkbox my-2 mr-2">
            <input type="radio" class="custom-control-input" id="a3" name="avatarInput" value="3">
            <label class="custom-control-label" for="a3">
              <img src="${avatar3}" alt="avatar1" class="img-fluid">
            </label>
          </div>
          <div class="custom-control custom-radio image-checkbox my-2 mr-2">
            <input type="radio" class="custom-control-input" id="a4" name="avatarInput" value="4">
            <label class="custom-control-label" for="a4">
              <img src="${avatar4}" alt="avatar1" class="img-fluid">
            </label>
          </div>
          <div class="custom-control custom-radio image-checkbox my-2 mr-2">
            <input type="radio" class="custom-control-input" id="a5" name="avatarInput" value="5">
            <label class="custom-control-label" for="a5">
              <img src="${avatar5}" alt="avatar1" class="img-fluid">
            </label>
          </div>
          <div class="custom-control custom-radio image-checkbox my-2 mr-2">
            <input type="radio" class="custom-control-input" id="a6" name="avatarInput" value="6">
            <label class="custom-control-label" for="a6">
              <img src="${avatar6}" alt="avatar1" class="img-fluid">
            </label>
          </div>
          <div class="custom-control custom-radio image-checkbox my-2 mr-2">
            <input type="radio" class="custom-control-input" id="a7" name="avatarInput" value="7">
            <label class="custom-control-label" for="a7">
              <img src="${avatar7}" alt="avatar1" class="img-fluid">
            </label>
          </div>
          <div class="custom-control custom-radio image-checkbox my-2 mr-2">
            <input type="radio" class="custom-control-input" id="a8" name="avatarInput" value="8">
            <label class="custom-control-label" for="a8">
              <img src="${avatar8}" alt="avatar1" class="img-fluid">
            </label>
          </div>
        </form> 
      </div>
      

      <!--Photo de profil-->
      <form class="col-sm-12 col-md-7 my-auto">
        <!--Username-->
        <div class="form-group row">
          <label for="username" class="col-2 col-form-label">Username</label>
          <div class="col">
            <input type="text" class="form-control border-0" id="username" value="${user.username}">
          </div>
        </div>

        <!--Email-->
        <div class="form-group row">
          <label for="email" class="col-2 col-form-label">Email</label>
          <div class="col">
            <input type="email" class="form-control border-0" id="email" value="${user.email}">
          </div>
        </div>

        <!--Nom-->
        <div class="form-group row">
          <label for="lName" class="col-2 col-form-label">Nom</label>
          <div class="col">
            <input type="text" class="form-control border-0" id="lName" value="${user.lName}">
          </div>
        </div>

        <!--Prenom-->
        <div class="form-group row">
          <label for="fName" class="col-2 col-form-label">Prénom</label>
          <div class="col">
            <input type="text" class="form-control border-0" id="fName" value="${user.fName}">
          </div>
        </div>

        <!--Bottom Buttons-->
        <div class="float-right">
        <button type="button" class="btn btn-outline-danger" alt="Annuler les modifications" id="cancelModification">
          Annuler
        </button>
        <button type="button" class="btn btn-outline-success" alt="Modifier son profil" id="btnModifyProfil">
          Sauvegarder 
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-wrench" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364L.102 2.223zm13.37 9.019L13 11l-.471.242-.529.026-.287.445-.445.287-.026.529L11 13l.242.471.026.529.445.287.287.445.529.026L13 15l.471-.242.529-.026.287-.445.445-.287.026-.529L15 13l-.242-.471-.026-.529-.445-.287-.287-.445-.529-.026z"></path>
          </svg>
        </button>
        </div>
      </form>`;
  
  let profilPartDiv = document.getElementById('mainProfilDiv');
  profilPartDiv.innerHTML = modifyUserPage;

  let idCurrentAvatar = 'a'+user.avatar;
  let currentAvatar = document.getElementById(idCurrentAvatar);
  currentAvatar.checked=true;

  let btnCancel = document.getElementById('cancelModification');
  btnCancel.addEventListener("click",function(){
    RedirectUrl("/profil");
  });

  let btnValid = document.getElementById('btnModifyProfil');

  btnValid.addEventListener("click",function(e){
    e.preventDefault();
    console.log("début sauvegarde");
    
    //vérifier si username et email sont correctes
    if(verifyModifications(user)){
      var avatars = document.getElementsByName("avatarInput");
      var avatarSelectionne;

      for(let index=0;index<avatars.length;index++){
        if(avatars[index].checked){
          avatarSelectionne=index+1;
          break;
        }
      }

      let newUser={
        userId: user.idUser,
        username: document.getElementById('username').value,
        email: document.getElementById("email").value,
        fName: document.getElementById("fName").value,
        lName: document.getElementById("lName").value,
        avatar: avatarSelectionne,
      }

      //on peut fetch PUT les données
      fetch(API_URL+"users/updateprofil",{
        method:"POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response)=>{
        if(response.ok){
          RedirectUrl("/profil");
        }
      })
    }
  });
  
};

const verifyModifications = (user)=>{
  clearErrorBox();

  var userId = user.idUser;
  var avatars = document.getElementsByName("avatarInput");
  var username = document.getElementById('username');
  var email = document.getElementById('email');
  var lName = document.getElementById('lName');
  var fName = document.getElementById('fName');
  var avatarSelectionne;

  for(let index=0;index<avatars.length;index++){
    if(avatars[index].checked){
      avatarSelectionne=index+1;
      break;
    }
  }

  var usernameIsAvailible;
  var emailIsAvailible;

  //Si le username actuel est != de celui rentré
  if(user.username!=username.value){
    if(verifyUsername(username.value)){
      usernameIsAvailible=true;
    } else{
      addErrorBoxOn(username);
      console.log("username est pas disponible");
      return false;
    }
  }
  else usernameIsAvailible=true;

  //Si l'email actuel est != de celui rentré
  if(user.email!=email.value){
    if(verifyEmail(email.value)){
      emailIsAvailible=true;
    } else{
      addErrorBoxOn(email);
      console.log("l'email rentré n'est pas valide ou est déjà utilisé par quelqu'un d'autre");
      return false;
    }
  }else emailIsAvailible=true;

  if(usernameIsAvailible && emailIsAvailible) return true;
  else return false;
};


function verifyUsername(username){
  fetch(API_URL+"/users/isUsernameAvailible/"+username,{
    method:"GET",
  }).then((isUsernameAvailible)=>{
    //username disponible
    if(isUsernameAvailible.status==200){
      return true;
    }
    else{ //username pas disponible
      return false;
    }
  });
}

function verifyEmail(email){
  //vérifie si le format de l'email est correct
  if(!isEmailGoodFormat(email)){
    return false;
  }else{
    fetch(API_URL+"/users/isEmailAvailible/"+email,{
      method:"GET",
    }).then((response)=>{
      //email disponible
      if(response.status==200){
        console.log('ok');
        return true;
      }
      else{ //email pas disponible
        console.log('ko');
        return false;
      }
    });
    return false;
  }
}

function isEmailGoodFormat(email){
  //Source for regex : https://www.codegrepper.com/code-examples/delphi/javascript+verify+email+address
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!emailRegex.test(email)){
    console.log("erreur format email");
    return false;
  }
  return true;
}

function clearErrorBox(){
  var username = document.getElementById('username');
  var email=document.getElementById('email');
  removeErrorBoxOn(username);
  removeErrorBoxOn(email);
}
const addErrorBoxOn = (type) =>{
  type.classList.add('border');
  type.classList.add('border-danger');
  type.classList.add('bg-danger');
}
const removeErrorBoxOn = (type) =>{
  type.classList.remove('border');
  type.classList.remove('border-danger');
  type.classList.remove('bg-danger');
}


export default ProfilPage;
