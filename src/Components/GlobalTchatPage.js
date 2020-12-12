import {setLayout} from "../utils/render.js";
import {getUserSessionData} from "../utils/session.js";
import {RedirectUrl} from "./Router.js";
import UserList from "./UserList.js";
import {API_URL} from "../utils/server";

let GlobalTchatSelector = document.querySelector("#page");

const GlobalTchatPage = () => {
    const userCredential = getUserSessionData();
    if (!userCredential) RedirectUrl("/error", 'Resource not authorized. Please <a href="/login">login</a>.');
    else {
        let messageData = [];
        /**
        Récupération des messages depuis le backend pour ensuite pouvoir les afficher de manière dynamique.
         */
        fetch(API_URL + "chats", {
            method: "GET",
            headers: {
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
        }).then((data) => {
            messageData = data;
            /**
             * Affichage dynamique de la conversation.
             * Affichage à droite pour l'utilisateur courant et affichage à gauche pour les autres.
             */
            messageData.forEach((element) => {
                if (element.idUser == getUserSessionData().idUser) {
                    let message = `<br><li id="msg1" class="list-group-item bg-success">  <span>${element.username}</span> : ${element.text} <span id="chatDate" class="float-left text-white-50">${element.date}</span> </li>`
                    document.querySelector('#Gchat').innerHTML += message;
                } else {
                    let message = `<br><li id="msg2" class="list-group-item bg-primary"> <span>${element.username}</span> : ${element.text}<span id="chatDate" class="float-right text-white-50">${element.date}</span> </li>`
                    document.querySelector('#Gchat').innerHTML += message;
                }
                var element = document.getElementById("Gchat");
                element.scrollTop = element.scrollHeight;
            });
        });


        UserList();
        let GlobalTchathtml = `
      <div id="chatBox" class="container-fluid float-left col-md-12 col-lg-8">
        <ul id="Gchat" class="container-fluid col-12 ml-1">
        
        </ul>

        <form class="col-12">
          <div class="form-group">
            <textarea class="form-control bg-dark text-white" id="message" placeholder="Tapez votre message..." rows="3"></textarea>
          </div>
          <button type="submit" class="btn btn-primary float-right">Envoyer</button>
          
        </form>
        <script src="GlobalTchatPage.js"></script>
      </div>`;
        setLayout("GIC : Message", "Game Items Collection", `Global Chat`, "My footer");


        GlobalTchatSelector.innerHTML = GlobalTchathtml;
        /**
         * A chaque envoie de message on gère le chatbox.
         */
        document.querySelector('form').addEventListener('submit', event => {
            event.preventDefault();
            let currentTimeDate = new Date();
            let currentTimeStamp = currentTimeDate.getDay()+"-"+currentTimeDate.getMonth()+"-"+ currentTimeDate.getFullYear()+"  "+ currentTimeDate.getUTCHours()+":"+ currentTimeDate.getUTCMinutes()+":"+currentTimeDate.getUTCSeconds();
            let username = userCredential.username;
            let message = username + " : " + document.querySelector('#message').value;
            connection.send(message);
            /**
             * Envoie les données "id user /name / message" pour la persistances des données dans le backend.
             */
            fetch(API_URL + "chats/" + getUserSessionData().idUser + "/" + getUserSessionData().username + "/" + document.querySelector('#message').value+"/"+ currentTimeStamp.toString(), {
                method: "POST",
                headers: {
                    Authorization: userCredential.token,
                },
            }).then((response) => {
                return response;
            }).then((data) => {

            });
            document.querySelector('#message').value = '';
        });
    }

    connection.onmessage = () => {
        /**
         * affichage dynamique des messages.
         */
        setTimeout(function () {
            RedirectUrl("/message");
        }, 500);
    }
};

const connection = new WebSocket('ws://localhost:8080');

connection.onopen = () => {
    console.log('connected');
};

connection.onclose = () => {
    console.error('disconnected');
};

connection.onerror = error => {
    console.error('failed to connect', error);
};



export default GlobalTchatPage;