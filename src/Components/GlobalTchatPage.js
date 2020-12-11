import { setLayout } from "../utils/render.js";
import { getUserSessionData } from "../utils/session.js";
import { RedirectUrl } from "./Router.js";
let GlobalTchatSelector = document.querySelector("#page")
const GlobalTchatPage = ()=>{
  const userCredential = getUserSessionData();
  if (!userCredential) RedirectUrl("/error", 'Resource not authorized. Please <a href="/login">login</a>.');
  else{
  setLayout("GIC : Message","Game Items Collection",`message`,"My footer");
  let GlobalTchathtml = `

  <ul id="Gchat"></ul>

  <form>
    <textarea rows="8" cols="80" id="message"></textarea>
    <br />
    <button type="submit">Send</button>
  </form>
  <script src="GlobalTchatPage.js"></script>
`;
  
  GlobalTchatSelector.innerHTML = GlobalTchathtml;
  document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    let message = document.querySelector('#message').value;
    connection.send(message);
    document.querySelector('#message').value = '';
  });}
  

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
  console.log('received', event.data);
  let li = document.createElement('li');
  li.innerText = event.data;
  document.querySelector('#Gchat').append(li);
};

export default GlobalTchatPage;