"use strict";

///////////////////////////////////////
////////// LOGIN PAGE //////////////////
//////////////////////////////////////

// Selecting Html elements
const elForm = document.querySelector(".login-main__form");
const elNameInput = document.querySelector(".login-main__username-input");
const elPasswordInput = document.querySelector(".login-main__password-input");
let unsuccessful = document.querySelector(".login-main__unsuccesful");

// event listener

elForm.addEventListener("submit", function(evt) {
    evt.preventDefault();

    const inputName = elNameInput.value;
    const inputPassword = elPasswordInput.value;

    // fetch user data from "reqres.in" site

    fetch("https://reqres.in/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: inputName,
                password: inputPassword,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.token) {
                localStorage.setItem("token", data.token);

                location.replace("index.html");
            } else {
                unsuccessful.textContent = "Username or password is wrong !";
            }
        });

    inputName = "";
    inputPassword = "";
});