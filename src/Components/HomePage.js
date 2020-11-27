import Quote from "./Quote.js";
import { setLayout } from "../utils/render.js";

let page = document.querySelector("#page");

const HomePage = () => {    
  setLayout("GIC : Home","Game Items Collection","Home Page","My footer");
  page.innerHTML = `<div id="quote"></div>`;
};

export default HomePage;
