/*
*Cette page à étée réalisée en s'inspirant des tutoriels suivant:
*Vidéo youtube de David Tang nommé Intro to Web Sockets in Node.js lien: https://www.youtube.com/watch?v=dQTzL3enFng&feature=youtu.be&ab_channel=DavidTang
*Vidéo youtube de Fireship nommé WebSockets in 100 Seconds & Beyond with Socket.io lien: https://www.youtube.com/watch?v=1BfCnjr_Vjg&ab_channel=Fireship
*/
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
        Récupération des messages depuis le backend pour ensuite pouvoir les afficher.
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
             * Affichage à droite pour l'utilisateur courant et affichage à gauche pour les autres.
             */
            messageData.forEach((element) => {
                if (element.idUser == getUserSessionData().idUser) {
                    let message = `<br><li id="msg1" class="list-group-item bg-success border-secondary">  <span>${element.username}</span> : ${element.text} <span id="chatDate" class="float-left text-white-50">${element.date}</span> </li>`
                    document.querySelector('#Gchat').innerHTML += message;
                } else {
                    let message = `<br><li id="msg2" class="list-group-item bg-primary border-secondary"> <span>${element.username}</span> : ${element.text}<span id="chatDate" class="float-right text-white-50">${element.date}</span> </li>`
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
            <textarea class="form-control bg-dark border-secondary text-white" id="message" placeholder="Tapez votre message..." rows="3"></textarea>
          </div>
          <button type="submit" class="btn btn-outline-primary float-right">Envoyer</button>
          
        </form>
      </div>`;
        setLayout("GIC : Message", "Game Items Collection", `Chat Global`, "");


        GlobalTchatSelector.innerHTML = GlobalTchathtml;
        /**
         * A chaque envoie de message on gère le chatbox.
         */
        document.querySelector('form').addEventListener('submit', event => {
            event.preventDefault();
            let currentTimeDate = new Date();
            let currentTimeStamp = currentTimeDate.getDate()+"-"+currentTimeDate.getMonth()+"-"+ currentTimeDate.getFullYear()+"  "+ currentTimeDate.getUTCHours()+":"+ currentTimeDate.getUTCMinutes()+":"+currentTimeDate.getUTCSeconds();
            let username = userCredential.username;
            let data={
                message:document.querySelector('#message').value,
                id:getUserSessionData().idUser
            }
            connection.send(JSON.stringify(data));
            /**
             * Envoie les données "id user /name / message" pour la persistances des données dans le backend.
             */
            let tosend = {
                id:getUserSessionData().idUser,
                username:getUserSessionData().username,
                text:document.querySelector('#message').value,
                date:currentTimeStamp,
            }
            fetch(API_URL + "chats/", {
                method: "POST",
                body:JSON.stringify(tosend),

                headers: {
                    Authorization: userCredential.token,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                return response;
            }).then((data) => {

            });
            document.querySelector('#message').value = '';
        });
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

connection.onmessage = event => {
    const userCredential = getUserSessionData();
    let currentTimeDate = new Date();
    let currentTimeStamp = currentTimeDate.getDate()+"-"+currentTimeDate.getMonth()+"-"+ currentTimeDate.getFullYear()+"  "+ currentTimeDate.getUTCHours()+":"+ currentTimeDate.getUTCMinutes()+":"+currentTimeDate.getUTCSeconds();
    let texto = JSON.parse(event.data);
    if(texto.id == getUserSessionData().idUser){
        let message = `<br><li id="msg1" class="list-group-item bg-success border-secondary">  <span>${userCredential.username}</span> : ${texto.message} <span id="chatDate" class="float-left text-white-50">${currentTimeStamp}</span> </li>`
        document.querySelector('#Gchat').innerHTML += message;
    }
    else{
        let message = `<br><li id="msg2" class="list-group-item bg-primary border-secondary"> <span>${userCredential.username}</span> : ${texto.message}<span id="chatDate" class="float-right text-white-50">${currentTimeStamp}</span> </li>`
        document.querySelector('#Gchat').innerHTML += message;
    }
    var element = document.getElementById("Gchat");
    element.scrollTop = element.scrollHeight;
};
   




export default GlobalTchatPage;