let GlobalTchatSelector = document.querySelector("#tchatGlobal")
const GlobalTchat = ()=>{
  
    let GlobalTchathtml = `

  <ul id="Gchat"></ul>
  <form>
    <textarea class="btn btn-secondary" rows="1" cols="80" id="message"></textarea>
    <br />
    <button class="btn btn-primary" type="submit">Envoyer</button>
  </form>

`;
    
    GlobalTchatSelector.innerHTML = GlobalTchathtml;
    document.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      let message = document.querySelector('#message').value;
      connection.send(message);
      document.querySelector('#message').value = '';
    });
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





export default GlobalTchat;