import {RedirectUrl} from "./Router";
import {API_URL} from "../utils/server";

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
}).then((data) => gameItemCollectionsList(data)).catch(
)
;
const gameItemCollectionsList = (data) => {
    console.log(data);
    let gameItemCollectionPage = `<h5> Ma collections d'item<h5>
        <ul class="list-group list-group-item">`;
    let gameItemCollectionList = document.querySelector("ul");
};