import {RedirectUrl} from "./Router";
import {API_URL} from "../utils/server";
import { setUserSessionData,getUserSessionData } from "../utils/session.js";
import { setLayout } from "../utils/render.js";
const FILE_PATH = __dirname + "./../data/users.json";

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
    .then((data) => ProfilPage(data))
    .catch();   
};

/*Permet de recuper les données de l'utilisateur connecter
* */
const ProfilPage = (data) => {
    const userCredential = getUserSessionData();

    // get current user
    if(userCredential){
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
            .then((user)=> onItemsPage(data,user)
            )
            .catch();
    }
    else{
         onItemsPage(data);
    }
};


const onItemsPage = (data,user) => {
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
    SelectGame +=`<div class="container mt-3"><div class="btn-group-vertical">`;

        
    var isActive="";
    if(jeuxSelectionner==""){
        isActive="active";
    }
    SelectGame+= `<button type="button" class="btn btn-primary ${isActive}" id="all">Tout afficher </button>`;

    listDesJeux.forEach(choixJeux=> {
        var isActive="";
        if(jeuxSelectionner==choixJeux.jeu){
            isActive="active";
        }
        SelectGame +=`
                <button type="button" class="btn btn-primary ${isActive}" id="${choixJeux.jeu}">${choixJeux.jeu} </button>`;
    });

    SelectGame+=`</div></div></div>`;



    if(getUserSessionData()){
        if(jeuxSelectionner===""){
            data.forEach(item => {
                HomeItemsPage+=getAffichage(item);
                if(user.itemCollections.includes(item.itemId)){
                    HomeItemsPage+= `<button type="button" class="btn btn-primary" id="remove">Retirer</button>`
                }
                else{
                    HomeItemsPage+= `<button type="button" class="btn btn-primary" id="add">ajouter</button>`
                }
                HomeItemsPage+=`</div></div></div>`;
            });
        }
        else{
            data.forEach(item => {
                if(item.jeu===jeuxSelectionner){
                    HomeItemsPage+=getAffichage(item);
                    if(user.itemCollections.includes(item.itemId)){
                        HomeItemsPage+= `<button type="button" class="btn btn-primary" id="remove">Retirer</button>`
                    }
                    else{
                        HomeItemsPage+= `<button type="button" class="btn btn-primary" id="add">ajouter</button>`
                    }
                    HomeItemsPage+=`</div></div></div>`;
                }
            });

        }
    }
    else{
        if(jeuxSelectionner===""){
            data.forEach(item => {
                HomeItemsPage+=getAffichage(item);
                HomeItemsPage+=`</div></div></div>`;
            });
        }
        else{
            data.forEach(item => {
                if(item.jeu===jeuxSelectionner){
                    HomeItemsPage+=getAffichage(item);
                    HomeItemsPage+=`</div></div></div>`;
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
    button = document.getElementById("add").onclick = function () {addItemToCollection(2,user.idUser)};

    function  changerJeux(nomJeux){
        jeuxSelectionner = nomJeux;
        ItemsPage();
    }


    function  addItemToCollection(idItem,idUser){
        fetch(API_URL+"users/item/"+idItem+"/"+idUser,{
            method:"PUT"
        })
        ItemsPage();
    }
    console.log(user.itemCollections);
};


export default ItemsPage;