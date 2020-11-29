import {RedirectUrl} from "./Router";
import {API_URL} from "../utils/server";
import { setUserSessionData,getUserSessionData } from "../utils/session.js";
import { setLayout } from "../utils/render.js";

let page = document.querySelector("#page");

const ItemsPage =() =>{
    setLayout("Game Item Collection","Game Items Collection","MyCollectionPage","My footer");

    const user = getUserSessionData();
    if (!user) RedirectUrl("/error", '<div class="text-center">Resource not authorized. Please <a href="/login" class="btn btn-primary btn-sm">login</a></div>');
    //"/api/users/" + idUser
    fetch(API_URL + "users", {
        method: "GET",
        headers: {
            Authorization: user.token,
        },
    })
    .then((response) => {
        if (!response.ok) {
            let fullErrorMessage = "Error code : " + response.status + ":" + response.statusText + "/nMessage : ";
            return response.text().then((errorMessage) => {
                fullErrorMessage += errorMessage;
                return fullErrorMessage;
            })
        }
        return response.json();
    })
    .then((data) => onItemsPage(data))
    .catch();   
}

const onItemsPage = (data) => {
    
    page.innerHTML = `<div class="col-12">Yo</div>`;
    console.log(data);
    //let gameItemCollectionPage = `<h5> Ma collections d'item<h5><ul class="list-group list-group-item">`;
    //let gameItemCollectionList = document.querySelector("ul");
};

export default ItemsPage;