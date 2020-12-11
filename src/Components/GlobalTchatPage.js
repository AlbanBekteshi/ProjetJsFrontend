import {setLayout} from "../utils/render.js";
import {getUserSessionData} from "../utils/session.js";
import {RedirectUrl} from "./Router.js";
import UserList from "./UserList.js";
import {API_URL} from "../utils/server";
// get my id
let myId = getUserSessionData().idUser;
let GlobalTchatSelector = document.querySelector("#page")
const GlobalTchatPage = () => {
    const userCredential = getUserSessionData();
    if (!userCredential) RedirectUrl("/error", 'Resource not authorized. Please <a href="/login">login</a>.');
    else {
        /*fetch(API_URL + "users/chat", {
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
            console.log(data);
        });*/
        UserList();
        setLayout("GIC : Message", "Game Items Collection", `Global Chat`, "My footer");
        let GlobalTchathtml = `
      <div class="row col-12 pt-2">
        <ul id="Gchat" class="col-12 ml-1">
        
        </ul>

        <form class="col-12">
          <div class="form-group">
            <textarea class="form-control" id="message" rows="3"></textarea>
          </div>
          <button type="submit" class="btn btn-primary float-right">Envoyer</button>
          
        </form>
        <script src="GlobalTchatPage.js"></script>
      </div>
    
  `;

        GlobalTchatSelector.innerHTML = GlobalTchathtml;
        document.querySelector('form').addEventListener('submit', event => {
            event.preventDefault();
            let username = userCredential.username;
            let message = username + " : " + document.querySelector('#message').value;
            connection.send(message);
            fetch(API_URL + "users/chat/" + myId + "/" + document.querySelector('#message').value, {
                method: "POST",
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
    let li = document.createElement('li');
    li.innerText = event.data;
    document.querySelector('#Gchat').append(li);
};

export default GlobalTchatPage;