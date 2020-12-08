import RegisterPage from "./LoginPage.js";
import { RedirectUrl } from "./Router.js";
import Navbar from "./Navbar.js";
import { getUserSessionData, removeSessionData } from "../utils/session.js";
import {API_URL} from "../utils/server";

const Logout = () => {
  fetch(API_URL + "users/logout/" +getUserSessionData().idUser, {
    method: "PUT",
    headers: {
      Authorization: getUserSessionData().token,
    }
  });
  removeSessionData();
  // re-render the navbar for a non-authenticated user
  Navbar();
  RedirectUrl("/login");
};

export default Logout;
