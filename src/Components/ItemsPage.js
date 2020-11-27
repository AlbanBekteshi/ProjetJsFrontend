import {RedirectUrl} from "./Router";
//import {API_URL} from "../utils/server";
import { setUserSessionData,getUserSessionData } from "../utils/session.js";
import { setLayout } from "../utils/render.js";

let page = document.querySelector("#page");

"/api/users/" + userId
fetch(API_URL + "users/" + userId, {
    method: "GET"
}).then((response) => {
    if (!response.ok) {
        let fullErrorMessage = "Error code : " + response.status + ":" + response.statusText + "/nMessage : ";
        return response.text().then((errorMessage) => {
            fullErrorMessage += errorMessage;
            return fullErrorMessage;
        })
    }
    return response.json();
}).then((data) => ItemsPage(data)).catch(
)
;
const ItemsPage = (data) => {
    setLayout("Game Item Collection","Game Items Collection","MyCollectionPage","My footer");
    page.innerHTML = `<div id="quote"></div>`;
    console.log(data);
    let gameItemCollectionPage = `<h5> Ma collections d'item<h5>
        <ul class="list-group list-group-item">`;
    let gameItemCollectionList = document.querySelector("ul");
};

export default ItemsPage;