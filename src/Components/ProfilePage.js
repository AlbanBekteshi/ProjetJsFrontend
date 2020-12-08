import { RedirectUrl } from "./Router.js";
import { getUserSessionData } from "../utils/session.js";
import { API_URL } from "../utils/server.js";
import { setLayout } from "../utils/render.js";

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
    console.log("items",items);
    if(typeof items==="string") onError(items);
    else onUserPage(user,items);
  }).catch((err) => onError(err));
  
};

const onUserPage = (user,items) => {
    setLayout("GIC : Profil de  "+user.username,"Game Items Collection",`Mon profil`,"My footer");
    
    let userPage = `
        <!--Photo de profil-->
        <div class="row col-12 mt-4">
            <div class="col-sm-6 col-md-5 mb-3 mb-md-0">
                <img src="https://source.unsplash.com/300x300" class="rounded mx-auto d-block" alt="Profile picture">
            </div>
            
            <!--Photo de profil-->
            <div class="col-sm-12 col-md-7 my-auto">
                <h5 class="text-underline">Username : ${user.username}</h5><br>
                <h5 class="text-underline">Email : ${user.email}</h5><br>
                <h5 class="text-underline">Nom : ${user.lName}</h5><br>
                <h5 class="text-underline">Prénom : ${user.fName}</h5><br>
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
    return (page.innerHTML = userPage);
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

export default ProfilPage;
