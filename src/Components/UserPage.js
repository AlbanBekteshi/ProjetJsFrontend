import { RedirectUrl } from "./Router.js";
import { getUserSessionData } from "../utils/session.js";
import { API_URL } from "../utils/server.js";
import { setLayout } from "../utils/render.js";

let page = document.querySelector("#page");

const UserPage = () => {
  setLayout("GIC : Users Page ","Game Items Collection","Profil Page","My footer");
  const user = getUserSessionData();
  if (!user) RedirectUrl("/error", 'Resource not authorized. Please <a href="/login">login</a>.');

  fetch(API_URL + "users/"+user.username, {
    method: "GET",
    headers: {
      Authorization: user.token,
    },
  })
    .then((response) => {
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
    })
    .then((data) => {
      if (typeof data === "string") onError(data);
      else onUserPage(data);
    })
    .catch((err) => onError(err));
};

const onUserPage = (data) => {
    setLayout("GIC : Profil de  "+data.username,"Game Items Collection",`Mon profil`,"My footer");
    console.log(data);
    let userListPage = `<ul class="list-group list-group-horizontal-lg">`;
    let userList = document.querySelector("ul");
    // Neat way to loop through all data in the array, create a new array of string elements (HTML li tags)
    // with map(), and create one string from the resulting array with join(''). '' means that the separator is a void string.
    userListPage += data
        
    userListPage += "</ul>";
    return (page.innerHTML = '<div class="col-12">'+userListPage+"</div>");
};

const onError = (err) => {
  console.error("UserListPage::onError:", err);
  let errorMessage;
  if (err.message) {
    errorMessage = err.message;
  } else errorMessage = err;
  if (errorMessage.includes("jwt expired"))
    errorMessage += "<br> Please logout first, then login.";
  RedirectUrl("/error", errorMessage);
};

export default UserPage;
