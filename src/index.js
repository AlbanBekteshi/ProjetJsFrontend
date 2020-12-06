import {Router} from "./Components/Router.js";
import Navbar from "./Components/Navbar.js";
/* use webpack style & css loader*/
import "./stylesheets/style.css";
/* load bootstrap css (web pack asset management) */
import 'bootstrap/dist/css/bootstrap.css';
/* load bootstrap module (JS) */
import 'bootstrap';

const HEADER_TITLE = "Header Page";
const PAGE_TITLE = "Page Title";
const FOOTER_TEXT = "Footer Page";

Navbar();

Router();
