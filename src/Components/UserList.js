let userList = document.querySelector("#userList");
import {getUserSessionData} from "../utils/session.js";
import {API_URL} from "../utils/server.js";

let list = [];
let connected = [];
let notConnected = [];
//Create User List

const UserList = () => {
    const userCredential = getUserSessionData();

    function listRenderer(data) {
        userList.innerHTML = `<h1 class="ml10">
            <span class="text-wrapper d-block bg-dark">
                <span class="letters bg-dark list-group-item text-success">Connectée :  <span class="text-white">${connected.length}/${list.length}</span></span>
            </span>
        </h1>`;

        data.forEach((element) => {
            let addUserList;
            if (getUserSessionData()) {
                if (!element.connected) {
                    addUserList = `<ul class="list-group bg-dark">
                                       <li class="list-group-item bg-secondary d-flex justify-content-between align-items-center">
                                       ${element.username}
                                         <span class="badge badge-primary badge-pill">Hors Ligne</span>
                                       </li>
                                    </ul>`;
                    userList.innerHTML += addUserList;
                } else {
                    addUserList = `<ul class="list-group bg-dark">
                                       <li class="list-group-item bg-secondary d-flex justify-content-between align-items-center">
                                        ${element.username}
                                         <span class="badge badge-success badge-pill">En ligne</span>
                                       </li>
                                    </ul>`;
                    userList.innerHTML += addUserList;
                }
            } else {
                return userList.innerHTML = '';

            }
        });
        anime.timeline({loop: true})
            .add({
                targets: '.ml10 .letter',
                rotateY: [-90, 0],
                duration: 750,
                delay: (el, i) => 45 * i
            }).add({
            targets: '.ml10',
            opacity: 0,
            duration: 500,
            easing: "easeOutExpo",
            delay: 1000
        });
        return userList;
    }

    function sortUser(data) {
        data.forEach((element) => {
            if (!element.connected) {
                notConnected.push(element);
            } else {
                connected.push(element);
            }
        });
        connected.forEach((element) => {
            list.push(element);
        });
        notConnected.forEach((element) => {
            list.push(element);
        });
        listRenderer(list);
    }

    if (userCredential) {
        fetch(API_URL + "users", {
            method: "GET",
            headers: {
                "Authorization": userCredential.token
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
            userList.innerHTML = '';
            list = [];
            connected = [];
            notConnected = [];
            sortUser(data);
        });

    } else {
        return userList.innerHTML = '';
    }
};

export default UserList;
