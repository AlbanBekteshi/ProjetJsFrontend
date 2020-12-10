/* External Assets
import'bootstrap/dist/css/bootstrap.css'; // Managed by Webpack Modules : style-loader https://webpack.js.org/loaders/style-loader/ and css-loader https://webpack.js.org/loaders/css-loader/
import'bootstrap'; // Managed by Webpack
import {​​​​​ io }​​​​​ from'socket.io-client';
constsocket = io('localhost:3000'); // Open a socket with the server listening on port 3000
socket.on('connect', () => {​​​​​ // Quand la connexion est établie
console.log('Socket Client ID:' + socket.id); // 'G5p5...'
console.log('Socket Connection Established');
}​​​​​);
socket.on('broadcast', (arg) => {​​​​​
console.log('From socket server, broadcast:' + arg);
}​​​​​);
*/
import {Router} from "./Components/Router.js";
import Navbar from "./Components/Navbar.js";;
/* use webpack style & css loader*/
import "./stylesheets/style.css";
/* load bootstrap css (web pack asset management) */
import 'bootstrap/dist/css/bootstrap.css';
/* load bootstrap module (JS) */
import 'bootstrap';
import GlobalTchat from "./Components/GlobalTchat.js";
import UserList from "./Components/UserList";

const HEADER_TITLE = "Header Page";
const PAGE_TITLE = "Page Title";
const FOOTER_TEXT = "Footer Page";

Navbar();
UserList();
Router();



GlobalTchat();