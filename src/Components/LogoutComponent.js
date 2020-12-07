import RegisterPage from "./LoginPage.js";
import { RedirectUrl } from "./Router.js";
import Navbar from "./Navbar.js";
import { getUserSessionData, setUserSessionData } from "../utils/session.js";
import {removeSessionData} from "../utils/session.js";
import {API_URL} from "../utils/server";

const Logout = () => {
  let idUser;
  idUser = getUserSessionData().idUser;
  console.log(idUser);
  let idUserJson = {idUser:idUser};
  fetch(API_URL + "users/logout/" +idUser, {
    method: "PUT",
    headers: {
      Authorization: getUserSessionData().token,
    }
  });
  removeSessionData();
  // re-render the navbar for a non-authenticated user
  Navbar();

};

export default Logout;
