import {RedirectUrl} from "./Router";
import {API_URL} from "../utils/server";
import { setUserSessionData,getUserSessionData } from "../utils/session.js";
import { setLayout } from "../utils/render.js";

let page = document.querySelector("#page");

/* jeuxSelctionner permet de choisir le jeux pour le quelle on veut voir les items
* il est initialisé a vide car au chargement on affiche tout les items disponible
* */
let jeuxSelectionner = "";

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
    
    /*totalPage est diviser en deux page différente
    * */
    let totalPage =`<div class="container-fluid"><div class="row">`;
    
    /*SelectGame est la parti gauche de totalPage qui contiens
    * les diffenrent bouton qui nous premettes de selectionner un jeux
    * */
    let SelectGame =`<div class=" col-2" id="itemsDivContainer">`;
    
    /*HomeItemsPages est la partie de droite ou les items s'afficherons en fonction du jeux choisit
    * */
    let HomeItemsPage =`<div class="row mt-3 col-10" id="itemsDivContainer">`;
    let button;

    /*Permet de selectionner da maniere distincte tout les differnt jeux disponible dans la dataBase
    * */
    const listDesJeux = Array.from (new Set(data.map( s => s.jeu)))
        .map(jeu =>{
            return {jeu:jeu};
        });
    
    /*Creation du container pour les different Button
    * et creation d'un bouton par jeuxDispo + ajout
    * */
    SelectGame +=`<div class="container"><div class="btn-group-vertical">`;

    listDesJeux.forEach(choixJeux=> {
        SelectGame +=`
                <button type="button" class="btn btn-primary" id="${choixJeux.jeu}">${choixJeux.jeu} </button>`;
    });
    SelectGame+= `<button type="button" class="btn btn-primary" id="all">Tout afficher </button>
            </div></div></div>`;


    if(getUserSessionData()){
        if(jeuxSelectionner===""){
            data.forEach(item => {
                HomeItemsPage+=getAffichage(item);
                HomeItemsPage+= `<p>Connecter</p>`
            });
        }
        else{
            data.forEach(item => {
                if(item.jeu===jeuxSelectionner){
                    HomeItemsPage+=getAffichage(item);
                    HomeItemsPage+= `<p>Connecter</p>`
                }
            });

        }
    }
    else{
        if(jeuxSelectionner===""){
            data.forEach(item => {
                HomeItemsPage+=getAffichage(item);
            });
        }
        else{
            data.forEach(item => {
                if(item.jeu===jeuxSelectionner){
                    HomeItemsPage+=getAffichage(item);
                }
            });

        }
    }





    HomeItemsPage+= `</div>`;
    totalPage+= SelectGame +HomeItemsPage +`</div></div>`;
    page.innerHTML = totalPage;


    /*Model qui permet d'afficher les items
    * */
    function getAffichage(item) {
        return `
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

    /*Permet de faire fonctionner les boutons
    * */
    fetch(API_URL+"items",{
        method:"GET",
    }).then((response) => {
        if (!response.ok) {
            let fullErrorMessage = "Error code : " + response.status + ":" + response.statusText + "/nMessage : ";
            return response.text().then((errorMessage) => {
                fullErrorMessage += errorMessage;
                return fullErrorMessage;
            })
        }
        return response.json();
    })
        .then((data) => {
            const result = Array.from (new Set(data.map( s => s.jeu)))
            .map(jeu =>{
                return {jeu:jeu};
            });

        result.forEach(jeuxChange =>{
            button = document.getElementById(jeuxChange.jeu).onclick = function () {changerJeux(jeuxChange.jeu)};
        })
        })
        .catch();
    button = document.getElementById("all").onclick = function () {changerJeux("")};
    function  changerJeux(nomJeux){
        jeuxSelectionner = nomJeux;
        ItemsPage();
    }

};


export default ItemsPage;