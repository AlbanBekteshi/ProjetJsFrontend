import { RedirectUrl } from "./Router.js";
import { getUserSessionData } from "../utils/session.js";
import { API_URL } from "../utils/server.js";
import { setLayout } from "../utils/render.js";

let page = document.querySelector("#page");

const UserPage = () => {
  const user = getUserSessionData();
  if (!user) RedirectUrl("/error", 'Resource not authorized. Please <a href="/login">login</a>.');

  fetch(API_URL + "users/"+user.username, {
    method: "GET",
    headers: {
      Authorization: user.token,
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
    .then((data) => {
      if (typeof data === "string") onError(data);
      else onUserPage(data);
    })
    .catch((err) => onError(err));
};

const onUserPage = (data) => {
    setLayout("GIC : Profil de  "+data.username,"Game Items Collection",`Mon profil`,"My footer");
    console.log(data);
    let userPage = `
        <!--Photo de profil-->
        <div class="row col-12 mt-4">
            <div class="col-sm-12 col-md-5 mb-3 mb-md-0">
                <img src="https://source.unsplash.com/300x300" class="rounded mx-auto d-block" alt="Profile picture">
            </div>
            <!--Photo de profil-->
            <div class="col-sm-12 col-md-7 my-auto">
                <h5 class="text-underline">Username : ${data.username}</h5><br>
                <h5 class="text-underline">Email : ${data.email}</h5><br>
                <h5 class="text-underline">Nom : ${data.lName}</h5><br>
                <h5 class="text-underline">Prénom : ${data.fName}</h5><br>
            </div>
        </div>

        <h3 class="col-sm-12">Mes items</h3>

        <div class="row mt-3 col-12 pl-3">

            <div class="col-md-3 col-sm-12">
                <div class="card bg-secondary p-1 mb-2">
                    <img src="https://source.unsplash.com/300x300" class="card-img-top mt-1" alt="ItemImg">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">Item Name</h5>
                        <p class="card-text">
                            <u>Jeu :</u> Nom du jeu <br>
                            <u>Description :</u> Desc de l'item <br>
                            <u>Prix :</u> prix de l'item<br>
                        </p>
                    </div>
                </div>  
            </div>

            <div class="col-md-3 col-sm-12">
                <div class="card bg-secondary p-1 mb-2">
                    <img src="https://source.unsplash.com/300x300" class="card-img-top mt-1" alt="ItemImg">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">Item Name</h5>
                        <p class="card-text">
                            <u>Jeu :</u> Nom du jeu <br>
                            <u>Description :</u> Desc de l'item <br>
                            <u>Prix :</u> prix de l'item<br>
                        </p>
                    </div>
                </div>  
            </div>
            
            <div class="col-md-3 col-sm-12">
                <div class="card bg-secondary p-1 mb-2">
                    <img src="https://source.unsplash.com/300x300" class="card-img-top mt-1" alt="ItemImg">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">Item Name</h5>
                        <p class="card-text">
                            <u>Jeu :</u> Nom du jeu <br>
                            <u>Description :</u> Desc de l'item <br>
                            <u>Prix :</u> prix de l'item<br>
                        </p>
                    </div>
                </div>  
            </div>

            <div class="col-md-3 col-sm-12">
                <div class="card bg-secondary p-1 mb-2">
                    <img src="https://source.unsplash.com/300x300" class="card-img-top mt-1" alt="ItemImg">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">Item Name</h5>
                        <p class="card-text">
                            <u>Jeu :</u> Nom du jeu <br>
                            <u>Description :</u> Desc de l'item <br>
                            <u>Prix :</u> prix de l'item<br>
                        </p>
                    </div>
                </div>  
            </div>

            <div class="col-md-3 col-sm-12">
                <div class="card bg-secondary p-1 mb-2">
                    <img src="https://source.unsplash.com/300x300" class="card-img-top mt-1" alt="ItemImg">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">Item Name</h5>
                        <p class="card-text">
                            <u>Jeu :</u> Nom du jeu <br>
                            <u>Description :</u> Desc de l'item <br>
                            <u>Prix :</u> prix de l'item<br>
                        </p>
                    </div>
                </div>  
            </div>

            <div class="col-md-3 col-sm-12">
                <div class="card bg-secondary p-1 mb-2">
                    <img src="https://source.unsplash.com/300x300" class="card-img-top mt-1" alt="ItemImg">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">Item Name</h5>
                        <p class="card-text">
                            <u>Jeu :</u> Nom du jeu <br>
                            <u>Description :</u> Desc de l'item <br>
                            <u>Prix :</u> prix de l'item<br>
                        </p>
                    </div>
                </div>  
            </div>

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

export default UserPage;
