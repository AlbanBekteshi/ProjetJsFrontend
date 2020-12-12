import {RedirectUrl} from "./Router";
import {API_URL} from "../utils/server";
import { setUserSessionData,getUserSessionData } from "../utils/session.js";
import { setLayout } from "../utils/render.js";
import UserList from "./UserList";
//Source https://stackoverflow.com/questions/42118296/dynamically-import-images-from-a-directory-using-webpack
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  
const images = importAll(require.context('./../images/items', false, /\.png$/));

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

/*Permet de recuperer les données de l'utilisateur connecter
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

/*Creation de la HomePage
* */
const onItemsPage = (data,user) => {
    UserList();
    setLayout("Game Item Collection","Game Items Collection","MyCollectionPage","My footer");
    
    /*totalPage est diviser en deux page différente
    * */
    let totalPage =`<div class="container-fluid"><div class="row">`;
    
    /*SelectGame est la parti gauche de totalPage qui contiens
    * les diffenrent bouton qui nous premettes de selectionner un jeux
    * */
    let SelectGame =`<div class="col-sm-12 col-md-2" id="itemsDivContainer">`;
    
    /*HomeItemsPages est la partie de droite ou les items s'afficherons en fonction du jeux choisit
    * */
    let HomeItemsPage =`<div class="row mt-3 col-sm-12 col-md-10" id="itemsDivContainer">
                        <div class="modal fade" id="myModal">
                            <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content">
                              
                                <!-- Modal Header -->
                                <div class="modal-header bg-dark">
                                  <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
                                </div>
                                
                                <!-- Modal body -->
                                <div class="modal-body bg-dark" id="modal_body">
                                  
                                </div>
                                
                                <!-- Modal footer -->
                                <div class="modal-footer bg-dark">
                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                                
                              </div>
                            </div>
                          </div>`;
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


    /*Verifie si quelqu'un est connecter et affiche la page en fonction
    * jeuxSelectionner nous indique si veut afficher un jeux en particuler ou afficher tout les jeux
    * la fonction getAffichage permet d'ajouter l'affichage commun a toute les pages
    * les boutons "Qui le possede" qui affiche le modal ne sont disponible que si un utilisateur est connecter
    * */
    if(getUserSessionData()){
        if(jeuxSelectionner===""){
            data.forEach(item => {
                HomeItemsPage+=getAffichage(item);
                HomeItemsPage+= `<button type="button" class="btn btn-link" id="has${item.itemId}" value="${item.itemId}" data-toggle="modal" data-target="#myModal">Qui le possede ? </button>`
                if(user.itemCollections.includes(item.itemId)){
                    HomeItemsPage+= `<button type="button" class="btn btn-danger" id="remove${item.itemId}">Retirer</button>`
                }
                else{
                    HomeItemsPage+= `<button type="button" class="btn btn-primary" id="add${item.itemId}">ajouter</button>`
                }
                HomeItemsPage+=`</div></div></div>`;
            });
        }
        else{
            data.forEach(item => {
                if(item.jeu===jeuxSelectionner){
                    HomeItemsPage+=getAffichage(item);
                    HomeItemsPage+= `<button type="button" class="btn btn-link" id="has${item.itemId}" value="${item.itemId}" data-toggle="modal" data-target="#myModal">Qui le possede ? </button>`
                    if(user.itemCollections.includes(item.itemId)){
                        HomeItemsPage+= `<button type="button" class="btn btn-danger" id="remove${item.itemId}">Retirer</button>`
                    }
                    else{
                        HomeItemsPage+= `<button type="button" class="btn btn-primary" id="add${item.itemId}">ajouter</button>`
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
        let image = images[item.image].default;
        return `
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 d-flex w-100">
                <div class="card bg-secondary p-1 mb-2">
                    <img src="${image}" class="card-img-top" alt="ItemImg" id="${image}">
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
    if (getUserSessionData()){
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
            .then((data) => {
                data.forEach(item =>{

                    if(jeuxSelectionner===""){
                        if(user.itemCollections.includes(item.itemId)){
                            var itiId = "has"+item.itemId;
                            button =document.getElementById(itiId).onclick = function (){ afficherModal(item.itemId)};
                            var itId = "remove"+item.itemId;
                            button = document.getElementById(itId).onclick = function(){ deleteItemToCollection(item.itemId,user.idUser)};
                        }
                        else{
                            var itiId = "has"+item.itemId;
                            button =document.getElementById(itiId).onclick = function (){ afficherModal(item.itemId)};
                            var itId = "add"+item.itemId;
                            button = document.getElementById(itId).onclick = function(){ addItemToCollection(item.itemId,user.idUser)};
                        }
                    }
                    else{
                        if(item.jeu ===jeuxSelectionner){
                            if(user.itemCollections.includes(item.itemId)){
                                var itiId = "has"+item.itemId;
                                button =document.getElementById(itiId).onclick = function (){ afficherModal(item.itemId)};
                                var itId = "remove"+item.itemId;
                                button = document.getElementById(itId).onclick = function(){ deleteItemToCollection(item.itemId,user.idUser)};
                            }
                            else{
                                var itiId = "has"+item.itemId;
                                button =document.getElementById(itiId).onclick = function (){ afficherModal(item.itemId)};
                                var itId = "add"+item.itemId;
                                button = document.getElementById(itId).onclick = function(){ addItemToCollection(item.itemId,user.idUser)};
                            }
                        }
                    }

                })
            })
            .catch();
    }


    button = document.getElementById("all").onclick = function () {changerJeux("")};

    /*Fait fonctionner le modal et le rempli en condition du bouton cliquer
    * */
    function  afficherModal(idItem){
        fetch(API_URL+"users/getUserFromItem/"+idItem,{
            method:"GET",
        }).then((response)=>{
            if (response.ok) return response.json();
        }).then((liste) => {
            afficherModal2(liste);
        });
    }

    function afficherModal2(list){
        let modal = document.getElementById("modal_body");
        let partHtml='';
        list.forEach(user =>{
            partHtml +=`Username : ${user.username}<br>Email : ${user.email}
            <hr>`;
        });
        modal.innerHTML = partHtml;
        let modalGlobal = document.getElementById('myModal');

    }

    /*Permet de changer le jeux a afficher
    * */
    function  changerJeux(nomJeux){
        jeuxSelectionner = nomJeux;
        ItemsPage();
    }

    /*Ajout d'un item a sa collection
    * */
    function  addItemToCollection(idItem,idUser){
        fetch(API_URL+"users/item/"+idItem+"/"+idUser,{
            method:"PUT"
        })
        ItemsPage();
    }

    /*Suppression d'un item de sa collection
    * */
    function deleteItemToCollection(idItem,idUser){
        fetch(API_URL+"users/item/"+idItem+"/"+idUser,{
            method:"POST"
        })
        ItemsPage();
    };
};


export default ItemsPage;