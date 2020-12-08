import {RedirectUrl} from "./Router";
import {API_URL} from "../utils/server";
import { setUserSessionData,getUserSessionData } from "../utils/session.js";
import { setLayout } from "../utils/render.js";

let page = document.querySelector("#page");

const ItemsPage =() =>{
    fetch(API_URL + "items", {
        method: "GET",
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
    setLayout("Game Item Collection","Game Items Collection","MyCollectionPage","My footer");
    console.log("liste de tous les items");
    console.log(data);

    let jeuxSelectionner ="";
    let RealPage =`<div class="container-fluid"><div class="row">`;
    let SelectGame =`<div class=" col-2" id="itemsDivContainer">`;
    let HomeItemsPage =`<div class="row mt-3 col-10" id="itemsDivContainer">`;
    let button;

    //Fait un Distinct de tout les jeux different
    const result = Array.from (new Set(data.map( s => s.jeu)))
        .map(jeu =>{
            return {jeu:jeu};
        });

    SelectGame +=`<div class="container"><div class="btn-group-vertical">`;

    result.forEach(truc=> {
        SelectGame +=`
                <button type="button" class="btn btn-primary" id="${truc.jeu}">${truc.jeu} </button>`;
        var getId = "'"+truc.jeu+"'";
        console.log(getId);
        console.log(document.getElementById(getId));
        button = document.querySelector(`${truc.jeu}`);
        console.log(button);
        //buttone.addEventListener("click",function (){
        //    jeuxSelectionner = "";
       // });
    });
    SelectGame+= `</div></div></div>`;

    if(jeuxSelectionner===""){
        data.forEach(item => {
                HomeItemsPage+=`
        <div class="col-lg-2 col-md-3 col-sm-6">
                <div class="card bg-secondary p-1 mb-2">
                    <img src="https://source.unsplash.com/300x300" class="card-img-top" alt="ItemImg">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${item.name}</h5>
                        <p class="card-text">
                            <u>Jeu :</u> ${item.jeu} <br>
                            <u>Description :</u> ${item.description} <br>
                            <u>Prix :</u> ${item.price}<br>
                        </p>
                    </div>
                </div>  
            </div>
        `;
        });
    }
    else{
        data.forEach(item => {
            if(item.jeu==jeuxSelectionner){
                HomeItemsPage+=`
        <div class="col-lg-2 col-md-3 col-sm-6">
                <div class="card bg-secondary p-1 mb-2">
                    <img src="https://source.unsplash.com/300x300" class="card-img-top" alt="ItemImg">
                    <div class="card-body">
                        <h5 class="card-title font-weight-bold">${item.name}</h5>
                        <p class="card-text">
                            <u>Jeu :</u> ${item.jeu} <br>
                            <u>Description :</u> ${item.description} <br>
                            <u>Prix :</u> ${item.price}<br>
                        </p>
                    </div>
                </div>  
            </div>
        `;
            }
        });

    }



    HomeItemsPage+= `</div>`;
    RealPage+= SelectGame +HomeItemsPage +`</div></div>`;
    page.innerHTML = RealPage;
};


export default ItemsPage;