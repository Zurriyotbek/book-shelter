"use strict";

///////////////////////////////////////////////////////////
//////////////////// MAIN PAGE ///////////////////////////
/////////////////////////////////////////////////////////

// selecting html elements

const logoutBtn = document.querySelector(".header__btn");
// const localToken = localStorage.getItem("token");

// if (!localToken) {
//     location.replace("login-page.html");
// }

// Listen click event of 'Logout' button and leave main page

logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("token");

    location.replace("login-page.html");
});